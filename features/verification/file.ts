import { safeFetch } from "@/lib/safe-fetch";

//TODO: limit on file size
export const fetchTokensFromFile = async (hostname: string): Promise<string[] | null> => {
    const filePath = `https://${hostname}/.well-known/scansuite.txt`;
    const res = await safeFetch(filePath).catch(() => null);
    if (res === null) return null;
    if (res.status === 404) return [];
    return (await res.text()).split('\n').map(token => token.trim()).filter(token => token.length > 0);
};