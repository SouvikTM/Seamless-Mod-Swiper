import React from 'react';
import { get, set } from 'idb-keyval';
import type { ScoredMod, SwipeDecision } from '../types/mod';

export interface ApiKeys {
  nexus: string;
  ai: string;
}

export type ThemeMode = 'game' | 'minimal';

export interface StoredModSummary {
  id: number;
  name: string;
  url: string;
  author: string;
  logicScore: number;
  aiScore: number;
  gameDomain: string;
  version: string;
}

interface ProgressState {
  approved: StoredModSummary[];
  rejected: StoredModSummary[];
  lastReset: string;
}

interface SessionContextValue {
  apiKeys: ApiKeys;
  setApiKeys: (keys: ApiKeys) => void;
  clearApiKeys: () => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  progress: ProgressState;
  recordDecision: (mod: ScoredMod, decision: SwipeDecision) => void;
  resetProgress: () => void;
  loadingProgress: boolean;
}

const PROGRESS_KEY = 'seamless-mod-swiper/progress@v1';
const defaultProgress: ProgressState = {
  approved: [],
  rejected: [],
  lastReset: new Date().toISOString(),
};

const SessionContext = React.createContext<SessionContextValue | undefined>(undefined);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [apiKeys, setApiKeysState] = React.useState<ApiKeys>({ nexus: '', ai: '' });
  const [themeMode, setThemeMode] = React.useState<ThemeMode>('game');
  const [progress, setProgress] = React.useState<ProgressState>(defaultProgress);
  const [loadingProgress, setLoadingProgress] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    get<ProgressState>(PROGRESS_KEY)
      .then((stored) => {
        if (stored && isMounted) {
          setProgress(stored);
        }
      })
      .finally(() => {
        if (isMounted) setLoadingProgress(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const persistProgress = React.useCallback((updater: (prev: ProgressState) => ProgressState) => {
    setProgress((prev) => {
      const next = updater(prev);
      set(PROGRESS_KEY, next);
      return next;
    });
  }, []);

  const recordDecision = React.useCallback(
    (mod: ScoredMod, decision: SwipeDecision) => {
      persistProgress((prev) => {
        const entry: StoredModSummary = {
          id: mod.id,
          name: mod.name,
          url: mod.url,
          author: mod.author,
          logicScore: Math.round(mod.compatibility.logicScore),
          aiScore: Math.round(mod.compatibility.aiScore),
          gameDomain: mod.gameDomain,
          version: mod.version,
        };
        const nextList = [entry, ...prev[decision === 'approve' ? 'approved' : 'rejected']].filter(
          (item, index, self) => index === self.findIndex((candidate) => candidate.id === item.id),
        );
        return {
          ...prev,
          [decision === 'approve' ? 'approved' : 'rejected']: nextList.slice(0, 300),
        };
      });
    },
    [persistProgress],
  );

  const resetProgress = React.useCallback(() => {
    persistProgress(() => ({ ...defaultProgress, lastReset: new Date().toISOString() }));
  }, [persistProgress]);

  const setApiKeys = React.useCallback((next: ApiKeys) => {
    setApiKeysState(next);
  }, []);

  const clearApiKeys = React.useCallback(() => {
    setApiKeysState({ nexus: '', ai: '' });
  }, []);

  const value = React.useMemo(
    () => ({
      apiKeys,
      setApiKeys,
      clearApiKeys,
      themeMode,
      setThemeMode,
      progress,
      recordDecision,
      resetProgress,
      loadingProgress,
    }),
    [apiKeys, clearApiKeys, progress, recordDecision, resetProgress, themeMode, setThemeMode],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export const useSession = (): SessionContextValue => {
  const context = React.useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return context;
};
