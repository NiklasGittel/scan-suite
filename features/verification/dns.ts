import { Resolver } from 'node:dns/promises';

const resolver = new Resolver({ timeout: 3000, tries: 2 });
resolver.setServers(['1.1.1.1', '8.8.8.8']);

const dnsRegex = /^scansuite-verify=([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i

export const fetchTokensFromDns = async (hostname: string): Promise<string[] | null> => {
    const records = await resolver.resolveTxt(`_scansuite-verify.${hostname}`)
        .catch((err: NodeJS.ErrnoException) =>
            err.code === 'ENOTFOUND' || err.code === 'ENODATA' ? [] : null,
        );
    if (records === null) return null;

    const combinedRecords = records.map(r => r.join(''));
    const matches = combinedRecords.map(record => dnsRegex.exec(record)).filter(m => m !== null);
    return matches.map(m => m[1]);
};