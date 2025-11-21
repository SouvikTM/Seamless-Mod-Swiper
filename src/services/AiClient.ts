import type { GameDefinition } from '../types/game';
import type { NormalizedMod } from '../types/mod';

export interface AiScoreResult {
  score: number;
  rationale: string;
}

const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export class AiClient {
  constructor(private apiKey: string) {}

  async scoreMod(
    mod: NormalizedMod,
    game: GameDefinition,
    version: string,
    logicScore: number,
    logicNotes: string[],
  ): Promise<AiScoreResult> {
    const prompt = this.buildPrompt(mod, game, version, logicScore, logicNotes);
    try {
      const response = await fetch(`${GEMINI_ENDPOINT}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      });
      if (!response.ok) {
        throw new Error('AI provider rejected the request');
      }
      const payload = await response.json();
      const firstCandidate = payload?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      const parsed = this.extractScore(firstCandidate);
      if (parsed) {
        return parsed;
      }
    } catch (error) {
      console.warn('AI scoring fallback used', error);
    }
    return this.fallbackScore(mod, logicScore);
  }

  private buildPrompt(
    mod: NormalizedMod,
    game: GameDefinition,
    version: string,
    logicScore: number,
    logicNotes: string[],
  ): string {
    return [
      'You are an AI co-pilot that helps evaluate mod compatibility.',
      `Game: ${game.name}`,
      `Target version: ${version}`,
      `Mod name: ${mod.name}`,
      `Author: ${mod.author}`,
      `Summary: ${mod.summary}`,
      `Description: ${mod.description.slice(0, 1200)}`,
      `Logic-based score: ${logicScore}`,
      `Logic notes: ${logicNotes.join(' | ') || 'No additional notes'}`,
      'Respond in JSON with fields "score" (0-100 integer) and "rationale" (short sentence).',
    ].join('\n');
  }

  private extractScore(text: string): AiScoreResult | undefined {
    if (!text) return undefined;
    try {
      const cleaned = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (typeof parsed.score === 'number' && typeof parsed.rationale === 'string') {
        const normalizedScore = Math.max(0, Math.min(100, parsed.score));
        return { score: normalizedScore, rationale: parsed.rationale.trim() };
      }
    } catch (error) {
      const match = text.match(/(\d{2,3})/);
      if (match) {
        const fallbackScore = Math.max(0, Math.min(100, Number(match[1])));
        return { score: fallbackScore, rationale: text.replace(match[1], '').trim() || 'General compatibility estimate.' };
      }
    }
    return undefined;
  }

  private fallbackScore(mod: NormalizedMod, logicScore: number): AiScoreResult {
    const bias = mod.name.toLowerCase().includes('script extender') ? 8 : 0;
    const derived = Math.max(0, Math.min(100, Math.round(logicScore + bias - 5 + (mod.id % 11))));
    return {
      score: derived,
      rationale: 'Heuristic AI estimate derived from logic signals.',
    };
  }
}
