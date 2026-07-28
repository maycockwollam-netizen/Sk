/**
 * Web Search Tool for Agent
 * Allows the agent to search the web for information
 */

export interface WebSearchResult {
  title: string;
  url: string;
  content: string;
}

export interface WebSearchParams {
  query: string;
  max_results?: number;
}

/**
 * Web search tool implementation
 * Uses Tavily API for searching
 */
export async function webSearch(
  query: string,
  maxResults: number = 5
): Promise<WebSearchResult[]> {
  const apiKey = import.meta.env.VITE_TAVILY_API_KEY;
  
  if (!apiKey) {
    // Fallback to using browser to search
    return fallbackSearch(query, maxResults);
  }

  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        max_results: maxResults,
        include_answer: true,
        include_raw_content: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    return data.results?.map((result: {title: string; url: string; content: string}) => ({
      title: result.title,
      url: result.url,
      content: result.content,
    })) || [];
  } catch (error) {
    console.error('Web search error:', error);
    return fallbackSearch(query, maxResults);
  }
}

/**
 * Fallback: Use browser to search via a search engine
 */
async function fallbackSearch(
  query: string,
  _maxResults: number
): Promise<WebSearchResult[]> {
  return [{
    title: 'Use browser to search',
    url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
    content: `Please use browser_navigate to go to Google and search for: "${query}". Then use browser_get_content to extract the results.`,
  }];
}

/**
 * Format search results for the agent
 */
export function formatSearchResults(results: WebSearchResult[]): string {
  if (results.length === 0) {
    return 'No search results found.';
  }

  const formatted = results.map((result, index) => {
    return `${index + 1}. **${result.title}**
   URL: ${result.url}
   ${result.content.substring(0, 200)}...`;
  });

  return `## Search Results:\n\n${formatted.join('\n\n')}`;
}
