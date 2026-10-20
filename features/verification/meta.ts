import { fetchHead } from "@/lib/fetch-head";
import { parse } from "node-html-parser";

import { META_VERIFY_NAME } from "./constants";

export const fetchTokensFromMeta = async (hostname: string): Promise<string[] | null> => {
    const html = await fetchHead(`https://${hostname}`).catch(() => null);
    if (html===null) return null;
    return extractMetaTokens(html);
};

export function extractMetaTokens(html: string): string[] {
  return parse(html)
    .querySelectorAll('meta')
    .filter((el) => el.getAttribute('name')?.trim().toLowerCase() === META_VERIFY_NAME)
    .map((el) => el.getAttribute('content')?.trim())
    .filter((token): token is string => !!token);
}