import React from 'react';
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import type { ScoredMod, SwipeDecision } from '../types/mod';
import { ModCard } from './modcard/ModCard';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

interface SwipeDeckProps {
  mods: ScoredMod[];
  isLoading: boolean;
  isFetching: boolean;
  onDecision: (mod: ScoredMod, decision: SwipeDecision) => void;
  onReload: () => void;
}

const cardVariants = {
  initial: { opacity: 0, scale: 0.94, y: 30 },
  enter: { opacity: 1, scale: 1, y: 0 },
  exit: (decision: SwipeDecision) => ({
    opacity: 0,
    x: decision === 'approve' ? 500 : -500,
    rotate: decision === 'approve' ? 18 : -18,
  }),
};

export const SwipeDeck = ({ mods, isLoading, isFetching, onDecision, onReload }: SwipeDeckProps) => {
  const [index, setIndex] = React.useState(0);
  const [lastDecision, setLastDecision] = React.useState<SwipeDecision | null>(null);

  React.useEffect(() => {
    setIndex(0);
  }, [mods]);

  const activeMod = mods[index];
  const nextMod = mods[index + 1];
  const remaining = Math.max(0, mods.length - index);

  const handleDecision = React.useCallback(
    (decision: SwipeDecision) => {
      if (!activeMod) return;
      setLastDecision(decision);
      onDecision(activeMod, decision);
      setIndex((prev) => prev + 1);
    },
    [activeMod, onDecision],
  );

  useKeyboardShortcuts(Boolean(activeMod) && !isLoading, handleDecision);

  React.useEffect(() => {
    if (activeMod) {
      setLastDecision(null);
    }
  }, [activeMod?.id]);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-250, 0, 250], [-12, 0, 12]);

  const renderCard = () => {
    if (!activeMod && !isLoading && mods.length === 0) {
      return (
        <div className="empty-state">
          <p>No mods available yet. Load mods to begin swiping.</p>
          <button type="button" onClick={onReload}>Refresh Mods</button>
        </div>
      );
    }
    if (!activeMod) {
      return (
        <div className="empty-state">
          <p>Queue cleared! Fetch more mods to keep swiping.</p>
          <button type="button" onClick={onReload} disabled={isFetching}>
            {isFetching ? 'Loading…' : 'Load another batch'}
          </button>
        </div>
      );
    }

    const x = useMotionValue(0);
    const rotate = useTransform(x, [-250, 0, 250], [-12, 0, 12]);

    return (
      <AnimatePresence mode="wait" custom={lastDecision ?? 'approve'}>
        <motion.div
          key={activeMod.id}
          className="active-card"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.25}
          style={{ x, rotate }}
          variants={cardVariants}
          initial="initial"
          animate="enter"
          exit="exit"
          custom={lastDecision ?? 'approve'}
          onDragEnd={(_, info) => {
            if (info.offset.x > 120) {
              handleDecision('approve');
            } else if (info.offset.x < -120) {
              handleDecision('reject');
            }
          }}
        >
          <ModCard mod={activeMod} />
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <section className="card-stack-container">
      <div className="deck-meta">
        <span className="score-pill">Queue • {remaining} mods</span>
        {isFetching && <span className="score-pill">Refreshing…</span>}
      </div>
      {isLoading ? (
        <div className="empty-state">Loading mods…</div>
      ) : (
        <>
          {renderCard()}
          {nextMod && (
            <div className="next-preview">
              <p className="section-title">Next up</p>
              <strong>{nextMod.name}</strong>
              <span>by {nextMod.author}</span>
            </div>
          )}
          {activeMod && (
            <div className="action-row">
              <button type="button" className="ghost" onClick={() => handleDecision('reject')}>
                Reject (A)
              </button>
              <button type="button" onClick={() => handleDecision('approve')}>
                Approve (B)
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};
