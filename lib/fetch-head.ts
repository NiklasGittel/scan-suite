import { safeFetch } from "./safe-fetch";
const MAX_BYTES = 65536;

export async function fetchHead(url: string, maxBytes: number = MAX_BYTES): Promise<string | null> {
  const res = await safeFetch(url, { timeoutMs: 5000 });
  if (!res.ok || !res.body) return null;

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let html = '';
  let bytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      bytes += value.byteLength;
      html += decoder.decode(value, { stream: true });

      const end = html.search(/<\/head\s*>/i);
      if (end !== -1) return html.slice(0, end);   
      if (bytes >= maxBytes) break;              
    }
  } finally {
    await reader.cancel().catch(() => {});
  }

  return html;  
}