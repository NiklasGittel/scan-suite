import 'server-only';

import { lookup as dnsLookup, type LookupAddress } from 'node:dns';
import { isIP, type LookupFunction } from 'node:net';
import ipaddr from 'ipaddr.js';
import { Agent, fetch, type Response } from 'undici';

export class SafeFetchError extends Error {
  constructor(
    public code: 'blocked_address' | 'invalid_url' | 'cross_host_redirect' | 'too_many_redirects',
    message?: string,
  ) {
    super(message ?? code);
  }
}

function isPublicIp(ip: string): boolean {
  if (!ipaddr.isValid(ip)) return false;
  const addr = ipaddr.process(ip);   
  return addr.range() === 'unicast';
}

const safeLookup: LookupFunction = (hostname, options, callback) => {
  dnsLookup(hostname, { ...options, all: true }, (err, addresses) => {
    if (err) return callback(err, '');
    const list = addresses as LookupAddress[];

    if (list.length === 0 || !list.every((a) => isPublicIp(a.address))) {
      return callback(new SafeFetchError('blocked_address', `${hostname} resolves to a non-public address`), '');
    }
    if (options.all) callback(null, list);
    else callback(null, list[0].address, list[0].family);
  });
};

const agent = new Agent({
  connect: { lookup: safeLookup, timeout: 5000 },
});

function assertAllowedUrl(url: URL) {
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new SafeFetchError('invalid_url', `Protocol ${url.protocol} not allowed`);
  }
  if (url.port && url.port !== '80' && url.port !== '443') {
    throw new SafeFetchError('invalid_url', `Port ${url.port} not allowed`);
  }
  if (url.username || url.password) {
    throw new SafeFetchError('invalid_url', 'Credentials in URL not allowed');
  }
  const host = url.hostname.replace(/^\[|\]$/g, '');  
  if (isIP(host) && !isPublicIp(host)) {
    throw new SafeFetchError('blocked_address', `${host} is not a public address`);
  }
}

type SafeFetchOptions = {
  timeoutMs?: number;
  maxRedirects?: number;
  sameHostRedirectsOnly?: boolean;
};

export async function safeFetch(
  input: string,
  { timeoutMs = 5000, maxRedirects = 3, sameHostRedirectsOnly = true }: SafeFetchOptions = {},
): Promise<Response> {
  const signal = AbortSignal.timeout(timeoutMs);   // covers the whole chain, redirects included
  let url = new URL(input);
  const originalHost = url.hostname;

  for (let hop = 0; hop <= maxRedirects; hop++) {
    assertAllowedUrl(url);

    const res = await fetch(url, {
      dispatcher: agent,
      redirect: 'manual',
      signal,
      headers: { 'user-agent': 'ScanSuite-Verifier/1.0' },
    });

    const location = res.headers.get('location');
    if (res.status >= 300 && res.status < 400 && location) {
      await res.body?.cancel();
      const next = new URL(location, url);
      if (sameHostRedirectsOnly && next.hostname !== originalHost) {
        throw new SafeFetchError('cross_host_redirect', `Redirect to ${next.hostname} not allowed`);
      }
      url = next;
      continue;
    }

    return res;
  }

  throw new SafeFetchError('too_many_redirects');
}