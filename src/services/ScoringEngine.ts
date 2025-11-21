import type { GameDefinition } from '../types/game';
import type { ModComment, NormalizedMod, ScoreSignal } from '../types/mod';
import { containsPhrase, countPhraseMatches } from '../utils/text';
import { isAfter } from '../utils/date';

const BASE_SCORE = 50;
const POSITIVE_AUTHOR_KEYWORDS = ['compatible', 'support', 'verified', 'safe on'];
const NEGATIVE_AUTHOR_KEYWORDS = ['not compatible', "doesn't work", 'broken', 'unsafe on'];
const PARTIAL_KEYWORDS = ['partially', 'some issues', 'feature x broken', 'minor issues'];
const POSITIVE_USER_KEYWORDS = ['works on', 'running on', 'still works', 'confirmed', 'stable on'];
const NEGATIVE_USER_KEYWORDS = ["doesn't work", 'crash', 'broken with', 'fails on', 'not working'];
const SCRIPT_EXTENDER_KEYWORDS = ['script extender', 'skse', 'sfse', 'mod fixer', 'foundation'];

export interface LogicScoreResult {
  logicScore: number;
  signals: ScoreSignal[];
  notes: string[];
  heuristicAiScore: number;
}

export class ScoringEngine {
  constructor(private game: GameDefinition, private version: string) {}

  score(mod: NormalizedMod, comments: ModComment[]): LogicScoreResult {
    let logicScore = BASE_SCORE;
    const signals: ScoreSignal[] = [];
    const notes: string[] = [];

    const textSource = `${mod.summary} ${mod.description}`;
    const versionPhrases = this.buildVersionPhrases();

    if (containsPhrase(textSource, versionPhrases.map((phrase) => `${phrase} compatible`))) {
      logicScore += 35;
      signals.push({ label: 'Author-confirmed compatibility', weight: 35, type: 'positive' });
      notes.push('Author explicitly states compatibility with the selected patch.');
    }

    if (containsPhrase(textSource, versionPhrases.map((phrase) => `${phrase} not compatible`))) {
      logicScore -= 45;
      signals.push({ label: 'Author-declared incompatibility', weight: -45, type: 'negative' });
      notes.push('Author warns that this mod is currently incompatible.');
    }

    if (containsPhrase(textSource, NEGATIVE_AUTHOR_KEYWORDS)) {
      logicScore -= 30;
      signals.push({ label: 'Author reports breakage', weight: -30, type: 'negative' });
    }

    if (containsPhrase(textSource, PARTIAL_KEYWORDS)) {
      logicScore -= 10;
      signals.push({ label: 'Partial incompatibility notice', weight: -10, type: 'negative' });
    }

    const patch = this.game.recentPatches.find((entry) => entry.version === this.version);
    if (patch && isAfter(mod.updatedAt, patch.releasedAt)) {
      logicScore += 12;
      signals.push({ label: 'Updated after latest patch', weight: 12, type: 'positive' });
      notes.push('Update landed after the selected patch, suggesting maintenance.');
    }

    const scriptExtenderHit = SCRIPT_EXTENDER_KEYWORDS.concat(this.game.specialCaseKeywords ?? []).some((keyword) =>
      textSource.toLowerCase().includes(keyword.toLowerCase()) || mod.name.toLowerCase().includes(keyword.toLowerCase()),
    );
    if (scriptExtenderHit) {
      logicScore += 15;
      signals.push({ label: 'Core framework / extender', weight: 15, type: 'positive' });
    }

    const userConfirmations = this.extractMatches(comments, POSITIVE_USER_KEYWORDS, versionPhrases);
    if (userConfirmations >= 2) {
      logicScore += 15;
      signals.push({ label: 'Multiple users confirm compatibility', weight: 15, type: 'positive' });
      notes.push('Community posts after the patch report success.');
    } else if (userConfirmations === 1) {
      logicScore += 7;
      signals.push({ label: 'User confirmation', weight: 7, type: 'positive' });
    }

    const userBreakages = this.extractMatches(comments, NEGATIVE_USER_KEYWORDS, versionPhrases);
    if (userBreakages >= 2) {
      logicScore -= 25;
      signals.push({ label: 'Users report breakage', weight: -25, type: 'negative' });
    } else if (userBreakages === 1) {
      logicScore -= 12;
      signals.push({ label: 'Single issue report', weight: -12, type: 'negative' });
    }

    const versionMentions = countPhraseMatches(textSource, versionPhrases);
    if (!versionMentions && !userConfirmations) {
      notes.push('No explicit references to the selected patch were found.');
    }

    logicScore = Math.max(0, Math.min(100, logicScore));
    const heuristicAiScore = this.estimateAiScore(logicScore, scriptExtenderHit, notes);

    return { logicScore, signals, notes, heuristicAiScore };
  }

  private buildVersionPhrases(): string[] {
    const normalized = this.version.toLowerCase();
    return [
      normalized,
      `v${normalized}`,
      `version ${normalized}`,
      `patch ${normalized}`,
      `${this.game.shortName.toLowerCase()} ${normalized}`,
    ];
  }

  private extractMatches(comments: ModComment[], keywords: string[], versionPhrases: string[]): number {
    if (!comments.length) return 0;
    const normalized = comments.map((comment) => comment.comment?.toLowerCase() ?? '');
    const matches = normalized.filter((comment) =>
      keywords.some((keyword) => comment.includes(keyword.toLowerCase())) &&
      (versionPhrases.some((phrase) => comment.includes(phrase)) || keywords.some((keyword) => comment.includes(keyword))),
    );
    return matches.length;
  }

  private estimateAiScore(score: number, specialCase: boolean, notes: string[]): number {
    let aiScore = score;
    if (specialCase) {
      aiScore = Math.max(aiScore, 80);
    }
    if (notes.some((note) => note.includes('No explicit references'))) {
      aiScore -= 5;
    }
    return Math.max(0, Math.min(100, aiScore));
  }
}
