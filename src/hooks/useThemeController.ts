import React from 'react';
import type { GameDefinition } from '../types/game';
import type { ThemeMode } from '../context/SessionContext';

const MINIMAL_THEME = {
  accent: '#64e1a7',
  accentSoft: 'rgba(100, 225, 167, 0.18)',
  background: '#050505',
  surface: '#101010',
  surfaceElevated: '#171717',
  text: '#f5f5f5',
  border: 'rgba(255, 255, 255, 0.08)',
  glow: '0 0 24px rgba(100, 225, 167, 0.35)',
};

export const useThemeController = (mode: ThemeMode, game?: GameDefinition) => {
  React.useEffect(() => {
    const palette = mode === 'game' && game ? game.theme : MINIMAL_THEME;
    const root = document.documentElement;
    root.style.setProperty('--color-background', palette.background);
    root.style.setProperty('--color-surface', palette.surface);
    root.style.setProperty('--color-surface-elevated', palette.surfaceElevated);
    root.style.setProperty('--color-border', palette.border);
    root.style.setProperty('--color-text', palette.text);
    root.style.setProperty('--color-accent', palette.accent);
    root.style.setProperty('--color-accent-soft', palette.accentSoft);
    root.style.setProperty('--shadow-card', palette.glow);
  }, [mode, game]);
};
