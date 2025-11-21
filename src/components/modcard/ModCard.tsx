import type { ScoredMod } from '../../types/mod';
import { extractSnippet } from '../../utils/text';
import { formatRelativeDate } from '../../utils/date';
import './modcard.css';

interface ScoreMeterProps {
  label: string;
  value: number;
  accent: string;
}

const ScoreMeter = ({ label, value, accent }: ScoreMeterProps) => (
  <div className="score-meter">
    <div className="score-meter__label">
      <span>{label}</span>
      <span className="score-meter__value">{Math.round(value)}</span>
    </div>
    <div className="score-meter__track">
      <div className="score-meter__bar" style={{ width: `${Math.min(100, value)}%`, background: accent }} />
    </div>
  </div>
);

interface ModCardProps {
  mod: ScoredMod;
}

export const ModCard = ({ mod }: ModCardProps) => {
  const snippet = extractSnippet(mod.description, 420) || extractSnippet(mod.summary, 420);
  return (
    <article className="mod-card">
      <div className="mod-card__header">
        <div
          className="mod-card__thumb"
          style={{
            backgroundImage: mod.thumbnail
              ? `linear-gradient(135deg, rgba(0,0,0,0.35), rgba(0,0,0,0.1)), url(${mod.thumbnail})`
              : 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
          }}
        />
        <div>
          <p className="mod-card__meta">Updated {formatRelativeDate(mod.updatedAt)}</p>
          <h2 className="mod-card__title">{mod.name}</h2>
          <p className="mod-card__meta">
            by {mod.author} • v{mod.version}
          </p>
        </div>
      </div>

      <div className="mod-card__summary">{snippet}</div>

      <div className="mod-card__scores">
        <ScoreMeter label="Logic Score" value={mod.compatibility.logicScore} accent="var(--color-accent)" />
        <ScoreMeter label="AI Reasoning" value={mod.compatibility.aiScore} accent="#c084fc" />
      </div>

      <ul className="mod-card__signals">
        {mod.compatibility.signals.slice(0, 6).map((signal) => (
          <li key={`${signal.label}-${signal.type}`} className={`mod-card__signal ${signal.type}`}>
            {signal.label}
          </li>
        ))}
      </ul>

      <div className="mod-card__notes">
        {mod.compatibility.notes.map((note) => (
          <p key={note}>{note}</p>
        ))}
      </div>

      <a className="mod-card__cta" href={mod.url} target="_blank" rel="noreferrer">
        View on Nexus Mods →
      </a>
    </article>
  );
};
