/**
 * Hosted API client for memable MCP server.
 * 
 * When MEMABLE_API_URL and MEMABLE_API_KEY are set, the MCP server
 * proxies requests to the hosted memable service instead of using
 * local storage.
 */

export interface HostedClientConfig {
  apiUrl: string;
  apiKey: string;
}

export class HostedMcpClient {
  private apiUrl: string;
  private apiKey: string;

  constructor(config: HostedClientConfig) {
    this.apiUrl = config.apiUrl.replace(/\/$/, ''); // Remove trailing slash
    this.apiKey = config.apiKey;
  }

  private async fetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${this.apiUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey,
      ...(options.headers as Record<string, string> || {}),
    };

    return fetch(url, {
      ...options,
      headers,
    });
  }

  async remember(args: {
    text: string;
    type?: string;
    durability?: string;
  }): Promise<{
    success: boolean;
    memory_id?: string;
    text: string;
  }> {
    const res = await this.fetch('/mcp/tools/remember', {
      method: 'POST',
      body: JSON.stringify({
        text: args.text,
        memory_type: args.type || 'fact',
        durability: args.durability || 'situational',
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Remember failed: ${error}`);
    }

    return res.json();
  }

  async recall(args: {
    query: string;
    limit?: number;
    type?: string;
  }): Promise<{
    memories: Array<{
      id: string;
      text: string;
      memory_type: string;
      confidence: number;
    }>;
  }> {
    const res = await this.fetch('/mcp/tools/recall', {
      method: 'POST',
      body: JSON.stringify({
        query: args.query,
        limit: args.limit || 5,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Recall failed: ${error}`);
    }

    return res.json();
  }

  async listMemories(args: {
    limit?: number;
  } = {}): Promise<{
    memories: Array<{
      id: string;
      text: string;
      memory_type: string;
    }>;
  }> {
    const params = new URLSearchParams();
    if (args.limit) params.set('limit', String(args.limit));
    
    const res = await this.fetch(`/mcp/tools/list?${params}`, {
      method: 'GET',
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`List failed: ${error}`);
    }

    return res.json();
  }

  async forget(args: { id: string }): Promise<{ success: boolean }> {
    const res = await this.fetch('/mcp/tools/forget', {
      method: 'POST',
      body: JSON.stringify({ memory_id: args.id }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Forget failed: ${error}`);
    }

    return res.json();
  }

  async extract(args: {
    conversation: string;
    store?: boolean;
  }): Promise<{
    memories: Array<{ text: string; memory_type: string }>;
    count: number;
  }> {
    const res = await this.fetch('/mcp/tools/extract', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: args.conversation }],
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Extract failed: ${error}`);
    }

    return res.json();
  }
}

/**
 * Check if hosted mode is configured.
 */
export function isHostedMode(): boolean {
  return !!(process.env.MEMABLE_API_URL && process.env.MEMABLE_API_KEY);
}

/**
 * Create a hosted client from environment variables.
 */
export function createHostedClient(): HostedMcpClient {
  const apiUrl = process.env.MEMABLE_API_URL;
  const apiKey = process.env.MEMABLE_API_KEY;

  if (!apiUrl || !apiKey) {
    throw new Error('MEMABLE_API_URL and MEMABLE_API_KEY are required for hosted mode');
  }

  return new HostedMcpClient({ apiUrl, apiKey });
}
