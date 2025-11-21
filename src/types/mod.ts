export interface NexusModSummary {
  mod_id: number;
  name: string;
  summary: string;
  description?: string;
  version: string;
  author: string;
  mod_page_url: string;
  picture_url?: string;
  game?: string;
  uploaded_timestamp?: number;
  created_timestamp?: number;
  updated_timestamp?: number;
  contains_adult_content?: boolean;
}

export interface ModComment {
  comment_id?: number;
  timestamp?: number;
  username?: string;
  comment?: string;
}

export interface NormalizedMod {
  id: number;
  name: string;
  summary: string;
  description: string;
  version: string;
  author: string;
  url: string;
  thumbnail?: string;
  updatedAt: string;
  createdAt: string;
  gameDomain: string;
  containsAdultContent?: boolean;
}

export interface ScoreSignal {
  label: string;
  weight: number;
  type: 'positive' | 'negative';
}

export interface CompatibilityBreakdown {
  logicScore: number;
  aiScore: number;
  signals: ScoreSignal[];
  notes: string[];
}

export interface ScoredMod extends NormalizedMod {
  compatibility: CompatibilityBreakdown;
}

export type SwipeDecision = 'approve' | 'reject';
