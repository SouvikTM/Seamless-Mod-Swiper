import type { ThemeMode } from '../context/SessionContext';

interface SettingsMenuProps {
  themeMode: ThemeMode;
  onToggleTheme: () => void;
  approvedCount: number;
  rejectedCount: number;
  onResetProgress: () => void;
  onExport: () => void;
  onEditKeys: () => void;
}

export const SettingsMenu = ({
  themeMode,
  onToggleTheme,
  approvedCount,
  rejectedCount,
  onResetProgress,
  onExport,
  onEditKeys,
}: SettingsMenuProps) => (
  <section>
    <p className="section-title">Settings</p>
    <div className="stat-pill" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Theme</span>
        <button type="button" onClick={onToggleTheme} style={{ padding: '0.4rem 0.9rem' }}>
          {themeMode === 'game' ? 'Switch to Minimal Dark' : 'Match Game Aesthetic'}
        </button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Approved Mods</span>
        <strong>{approvedCount}</strong>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Rejected Mods</span>
        <strong>{rejectedCount}</strong>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button type="button" onClick={onExport} style={{ flex: 1 }}>
          Export Approved
        </button>
        <button type="button" className="ghost" onClick={onEditKeys} style={{ flex: 1 }}>
          Update API Keys
        </button>
      </div>
      <button
        type="button"
        onClick={onResetProgress}
        style={{
          background: 'rgba(248,113,113,0.1)',
          border: '1px solid rgba(248,113,113,0.35)',
          color: '#f87171',
          padding: '0.65rem 1rem',
        }}
      >
        Reset progress
      </button>
    </div>
  </section>
);
