import React from 'react';

const ModCard = ({ mod, logicScore, aiScore }) => {
    if (!mod) return null;

    const getScoreColor = (score) => {
        if (score >= 80) return 'var(--color-success)';
        if (score >= 50) return 'var(--color-accent)';
        return 'var(--color-error)';
    };

    return (
        <div className="mod-card" style={{
            background: 'var(--color-surface)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
        }}>
            {/* Image Header */}
            <div style={{ height: '40%', overflow: 'hidden', position: 'relative' }}>
                {mod.pictureUrl ? (
                    <img
                        src={mod.pictureUrl}
                        alt={mod.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <div style={{ width: '100%', height: '100%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span>No Image</span>
                    </div>
                )}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                    padding: '1rem'
                }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{mod.name}</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.9rem', color: '#ccc' }}>
                        <span>by {mod.author}</span>
                        <span>v{mod.version}</span>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto' }}>
                {/* Scores */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ flex: 1, background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                        <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#888' }}>Logic Score</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: getScoreColor(logicScore.score) }}>
                            {logicScore.score}
                        </div>
                        <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                            {logicScore.signals.map((s, i) => (
                                <div key={i} style={{ color: s.type === 'positive' ? 'var(--color-success)' : 'var(--color-error)' }}>
                                    • {s.text}
                                </div>
                            ))}
                            {logicScore.signals.length === 0 && <span style={{ color: '#666' }}>No strong signals</span>}
                        </div>
                    </div>

                    <div style={{ flex: 1, background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                        <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#888' }}>AI Consensus</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: getScoreColor(aiScore.score) }}>
                            {aiScore.score}
                        </div>
                        <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', fontStyle: 'italic', color: '#aaa' }}>
                            "{aiScore.reasoning}"
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Description</h3>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.5', color: '#ddd' }}>
                        {mod.summary || "No description available."}
                    </p>
                </div>

                <div style={{ fontSize: '0.8rem', color: '#666', marginTop: 'auto' }}>
                    Last Updated: {new Date(mod.updatedAt).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
};

export default ModCard;
