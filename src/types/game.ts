export interface GameTheme {
  accent: string;
  accentSoft: string;
  background: string;
  surface: string;
  surfaceElevated: string;
  text: string;
  border: string;
  glow: string;
}

export interface GamePatch {
  version: string;
  releasedAt: string; // ISO timestamp
}

export interface GameDefinition {
  id: string;
  name: string;
  domain: string;
  shortName: string;
  versions: string[];
  defaultVersion: string;
  theme: GameTheme;
  heroGradient: string;
  accentTexture: string;
  recentPatches: GamePatch[];
  specialCaseKeywords?: string[];
}
