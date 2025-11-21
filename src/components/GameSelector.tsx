import type { GameDefinition } from '../types/game';

interface GameSelectorProps {
  games: GameDefinition[];
  selectedGame: GameDefinition;
  onGameChange: (gameId: string) => void;
  selectedVersion: string;
  onVersionChange: (version: string) => void;
}

export const GameSelector = ({
  games,
  selectedGame,
  onGameChange,
  selectedVersion,
  onVersionChange,
}: GameSelectorProps) => (
  <section>
    <p className="section-title">Game & Version</p>
    <div className="stat-pill" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <label>
        <span>Game</span>
        <select value={selectedGame.id} onChange={(event) => onGameChange(event.target.value)}>
          {games.map((game) => (
            <option key={game.id} value={game.id}>
              {game.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Target Version</span>
        <select value={selectedVersion} onChange={(event) => onVersionChange(event.target.value)}>
          {selectedGame.versions.map((version) => (
            <option key={version} value={version}>
              {version}
            </option>
          ))}
        </select>
      </label>
      <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>
        Latest patches: {selectedGame.recentPatches.map((patch) => patch.version).join(' • ')}
      </div>
    </div>
  </section>
);
