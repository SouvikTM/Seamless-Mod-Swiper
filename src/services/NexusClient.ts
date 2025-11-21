import type { ModComment, NexusModSummary } from '../types/mod';

const BASE_URL = 'https://api.nexusmods.com/v1';

export class NexusClient {
  private headers: HeadersInit;

  constructor(private apiKey: string) {
    this.headers = {
      apikey: apiKey,
      Accept: 'application/json',
    };
  }

  async fetchMods(gameDomain: string, desired = 60): Promise<NexusModSummary[]> {
    const mods: NexusModSummary[] = [];
    let page = 1;
    while (mods.length < desired && page <= 4) {
      const pageMods = await this.request<NexusModSummary[]>(
        `/games/${gameDomain}/mods/latest_added.json?page=${page}&include_unapproved=false`,
      );
      if (!Array.isArray(pageMods) || pageMods.length === 0) break;
      mods.push(...pageMods);
      page += 1;
    }
    return mods;
  }

  async fetchComments(gameDomain: string, modId: number, page: number): Promise<ModComment[]> {
    const data = await this.request<{ comments: ModComment[] }>(
      `/games/${gameDomain}/mods/${modId}/comments.json?page=${page}&include_reported=true`,
    );
    return data?.comments ?? [];
  }

  private async request<T>(path: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${path}`, {
      headers: this.headers,
    });
    if (!response.ok) {
      throw new Error(`Nexus API error ${response.status}: ${response.statusText}`);
    }
    return (await response.json()) as T;
  }
}
