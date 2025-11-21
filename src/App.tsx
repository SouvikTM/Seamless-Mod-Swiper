import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ApiKeyModal } from './components/ApiKeyModal';
import { GameSelector } from './components/GameSelector';
import { SettingsMenu } from './components/SettingsMenu';
import { SwipeDeck } from './components/SwipeDeck';
import { useSession } from './context/SessionContext';
import { SUPPORTED_GAMES } from './data/games';
import { useThemeController } from './hooks/useThemeController';
import { NexusClient } from './services/NexusClient';
import { ModService } from './services/ModService';
import { AiClient } from './services/AiClient';
import type { ScoredMod, SwipeDecision } from './types/mod';
import { exportApprovedMods } from './utils/export';

const DEFAULT_GAME = SUPPORTED_GAMES[0];

const App = () => {
  const [selectedGameId, setSelectedGameId] = React.useState(DEFAULT_GAME.id);
  const selectedGame = React.useMemo(
    () => SUPPORTED_GAMES.find((game) => game.id === selectedGameId) ?? DEFAULT_GAME,
    [selectedGameId],
  );
  const [selectedVersion, setSelectedVersion] = React.useState(selectedGame.defaultVersion);
  const [keysModalOpen, setKeysModalOpen] = React.useState(true);

  React.useEffect(() => {
    setSelectedVersion(selectedGame.defaultVersion);
  }, [selectedGame.id, selectedGame.defaultVersion]);

  const {
    apiKeys,
    setApiKeys,
    progress,
    recordDecision,
    resetProgress,
    themeMode,
    setThemeMode,
    loadingProgress,
  } = useSession();

  const hasKeys = Boolean(apiKeys.nexus && apiKeys.ai);

  React.useEffect(() => {
    if (hasKeys) {
      setKeysModalOpen(false);
    }
  }, [hasKeys]);

  useThemeController(themeMode, selectedGame);

  const modsQuery = useQuery<ScoredMod[]>({
    queryKey: ['mods', selectedGame.domain, selectedVersion, apiKeys.nexus, apiKeys.ai],
    enabled: hasKeys && Boolean(selectedVersion),
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const nexusClient = new NexusClient(apiKeys.nexus);
      const aiClient = apiKeys.ai ? new AiClient(apiKeys.ai) : undefined;
      const service = new ModService(nexusClient, aiClient);
      return service.fetchAndScoreMods(selectedGame, selectedVersion);
    },
  });

  const handleDecision = React.useCallback(
    (mod: ScoredMod, decision: SwipeDecision) => {
      recordDecision(mod, decision);
    },
    [recordDecision],
  );

  const handleReset = React.useCallback(() => {
    if (window.confirm('Reset all approved/rejected mods? This cannot be undone.')) {
      resetProgress();
    }
  }, [resetProgress]);

  const handleExport = React.useCallback(() => {
    if (!progress.approved.length) {
      window.alert('Approve at least one mod to export.');
      return;
    }
    exportApprovedMods(progress.approved);
  }, [progress.approved]);

  const requireKeys = !hasKeys;

  const handleModalClose = () => {
    if (hasKeys) {
      setKeysModalOpen(false);
    }
  };

  const heroStyle: React.CSSProperties = {
    background: selectedGame.heroGradient,
    borderRadius: '22px',
    padding: '1.25rem',
    border: '1px solid var(--color-border)',
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div style={heroStyle}>
          <p className="section-title">Seamless Mod Swiper</p>
          <h1 style={{ margin: '0.35rem 0 0.65rem' }}>{selectedGame.name}</h1>
          <p style={{ color: 'var(--color-muted)', margin: 0 }}>
            Swipe through randomized Nexus mods and focus on compatibility for version {selectedVersion}.
          </p>
        </div>
        <GameSelector
          games={SUPPORTED_GAMES}
          selectedGame={selectedGame}
          onGameChange={setSelectedGameId}
          selectedVersion={selectedVersion}
          onVersionChange={setSelectedVersion}
        />
        <SettingsMenu
          themeMode={themeMode}
          onToggleTheme={() => setThemeMode(themeMode === 'game' ? 'minimal' : 'game')}
          approvedCount={progress.approved.length}
          rejectedCount={progress.rejected.length}
          onResetProgress={handleReset}
          onExport={handleExport}
          onEditKeys={() => setKeysModalOpen(true)}
        />
      </aside>

      <main className="main-stage">
        {loadingProgress ? (
          <div className="empty-state">Loading session…</div>
        ) : requireKeys ? (
          <div className="empty-state">
            <p>Enter both API keys to unlock live Nexus data and AI scoring.</p>
            <button type="button" onClick={() => setKeysModalOpen(true)}>
              Provide API keys
            </button>
          </div>
        ) : (
          <SwipeDeck
            mods={modsQuery.data ?? []}
            isLoading={modsQuery.isLoading}
            isFetching={modsQuery.isFetching}
            onDecision={handleDecision}
            onReload={() => modsQuery.refetch()}
          />
        )}
        <div className="stat-pill" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Keyboard shortcuts</span>
          <span>A → Reject • B → Approve</span>
        </div>
      </main>

      <ApiKeyModal
        isOpen={keysModalOpen}
        initialValues={apiKeys}
        onClose={handleModalClose}
        onSubmit={(keys) => {
          setApiKeys(keys);
          setKeysModalOpen(false);
        }}
      />
    </div>
  );
};

export default App;
