import type { GameDefinition } from '../types/game';
import type { ModComment, NexusModSummary, NormalizedMod, ScoredMod } from '../types/mod';
import { shuffleArray, uniqueBy } from '../utils/array';
import { NexusClient } from './NexusClient';
import { AiClient } from './AiClient';
import { ScoringEngine } from './ScoringEngine';
import { MOCK_MODS } from './mockMods';

export class ModService {
  constructor(private nexusClient: NexusClient, private aiClient?: AiClient) {}

  async fetchAndScoreMods(game: GameDefinition, version: string): Promise<ScoredMod[]> {
    const { mods: rawMods, fallback } = await this.fetchModsWithFallback(game.domain);
    const normalizedMods = uniqueBy(
      rawMods.map((entry) => this.normalizeMod(entry, game.domain)),
      (mod) => mod.id,
    );
    const targetMods = shuffleArray(normalizedMods).slice(0, 60);
    const scoringEngine = new ScoringEngine(game, version);
    const results: ScoredMod[] = [];

    for (const mod of targetMods) {
      const comments = fallback ? [] : await this.fetchCommentsWithPagination(game.domain, mod.id);
      const logicResult = scoringEngine.score(mod, comments);
      const aiResult = this.aiClient
        ? await this.aiClient.scoreMod(mod, game, version, logicResult.logicScore, logicResult.notes)
        : { score: logicResult.heuristicAiScore, rationale: 'Derived from compatibility heuristics.' };

      results.push({
        ...mod,
        compatibility: {
          logicScore: logicResult.logicScore,
          aiScore: aiResult.score,
          signals: logicResult.signals,
          notes: [...logicResult.notes, `AI insight: ${aiResult.rationale}`],
        },
      });
    }

    return results;
  }

  private async fetchModsWithFallback(
    gameDomain: string,
  ): Promise<{ mods: NexusModSummary[]; fallback: boolean }> {
    try {
      const liveMods = await this.nexusClient.fetchMods(gameDomain, 70);
      if (liveMods?.length) {
        return { mods: liveMods, fallback: false };
      }
    } catch (error) {
      console.warn('Falling back to offline mod data', error);
    }
    return { mods: MOCK_MODS, fallback: true };
  }

  private normalizeMod(mod: NexusModSummary, gameDomain: string): NormalizedMod {
    const updated = (mod.updated_timestamp ?? mod.uploaded_timestamp ?? mod.created_timestamp ?? Date.now() / 1000) * 1000;
    const created = (mod.created_timestamp ?? mod.uploaded_timestamp ?? mod.updated_timestamp ?? Date.now() / 1000) * 1000;
    return {
      id: mod.mod_id,
      name: mod.name,
      summary: mod.summary,
      description: mod.description ?? mod.summary,
      version: mod.version,
      author: mod.author,
      url: mod.mod_page_url,
      thumbnail: mod.picture_url,
      updatedAt: new Date(updated).toISOString(),
      createdAt: new Date(created).toISOString(),
      gameDomain,
      containsAdultContent: Boolean(mod.contains_adult_content),
    };
  }

  private async fetchCommentsWithPagination(gameDomain: string, modId: number): Promise<ModComment[]> {
    const comments: ModComment[] = [];
    for (let page = 1; page <= 3; page += 1) {
      try {
        const pageComments = await this.nexusClient.fetchComments(gameDomain, modId, page);
        if (!pageComments.length) break;
        comments.push(...pageComments);
      } catch (error) {
        if (comments.length === 0) {
          return [];
        }
        break;
      }
    }
    return comments;
  }
}
