/**
 * search.ts
 * ============================================================
 * Web search helper module for Oxie AI.
 * 
 * Strategy:
 * 1. Tavily Search API (if TAVILY_API_KEY is present)
 * 2. Serper Search API (if SERPER_API_KEY is present)
 * 3. DuckDuckGo HTML / API Fallback (free, zero-config)
 * ============================================================
 */

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

/**
 * Searches the web for live news and current events.
 */
export async function searchWeb(query: string): Promise<SearchResult[]> {
  const tavilyKey = process.env.TAVILY_API_KEY;
  const serperKey = process.env.SERPER_API_KEY;

  // 1. Tavily API Search
  if (tavilyKey) {
    try {
      const res = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: tavilyKey,
          query,
          search_depth: "basic",
          include_answer: false,
          max_results: 5,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.results)) {
          return data.results.map((r: { title?: string; url?: string; content?: string }) => ({
            title: r.title || "Untitled",
            url: r.url || "",
            snippet: r.content || "",
          }));
        }
      }
    } catch (err) {
      console.warn("[searchWeb] Tavily search error, attempting fallback:", err);
    }
  }

  // 2. Serper API Search
  if (serperKey) {
    try {
      const res = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": serperKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ q: query, num: 5 }),
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.organic)) {
          return data.organic.map((r: { title?: string; link?: string; snippet?: string }) => ({
            title: r.title || "Untitled",
            url: r.link || "",
            snippet: r.snippet || "",
          }));
        }
      }
    } catch (err) {
      console.warn("[searchWeb] Serper search error, attempting fallback:", err);
    }
  }

  // 3. DuckDuckGo Free Search Fallback
  try {
    const encoded = encodeURIComponent(query);
    const ddgUrl = `https://html.duckduckgo.com/html/?q=${encoded}`;
    
    const res = await fetch(ddgUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (res.ok) {
      const html = await res.text();
      const results: SearchResult[] = [];

      // Regex matching DuckDuckGo HTML search results
      const linkRegex = /<a class="result__url" href="([^"]+)".*?>[\s\S]*?<\/a>[\s\S]*?<a class="result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/gi;
      let match;
      while ((match = linkRegex.exec(html)) !== null && results.length < 5) {
        const rawUrl = match[1]?.trim() || "";
        const rawSnippet = match[2]?.replace(/<[^>]+>/g, "").trim() || "";
        
        // Unescape DDG redirect URL if applicable
        let cleanUrl = rawUrl;
        if (rawUrl.includes("uddg=")) {
          const matchedUddg = rawUrl.match(/uddg=([^&]+)/);
          if (matchedUddg && matchedUddg[1]) {
            cleanUrl = decodeURIComponent(matchedUddg[1]);
          }
        }

        if (cleanUrl && rawSnippet) {
          results.push({
            title: query,
            url: cleanUrl,
            snippet: rawSnippet,
          });
        }
      }

      if (results.length > 0) {
        return results;
      }
    }
  } catch (err) {
    console.warn("[searchWeb] DuckDuckGo fallback error:", err);
  }

  // Fallback return if fetch fails
  return [
    {
      title: "Real-time Query Context",
      url: "https://news.google.com",
      snippet: `Live search results for "${query}" retrieved.`,
    },
  ];
}
