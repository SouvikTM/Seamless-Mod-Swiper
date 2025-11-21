import React from 'react';
import type { ApiKeys } from '../context/SessionContext';

interface ApiKeyModalProps {
  isOpen: boolean;
  initialValues: ApiKeys;
  onClose: () => void;
  onSubmit: (keys: ApiKeys) => void;
}

export const ApiKeyModal = ({ isOpen, initialValues, onClose, onSubmit }: ApiKeyModalProps) => {
  const [form, setForm] = React.useState<ApiKeys>(initialValues);

  React.useEffect(() => {
    setForm(initialValues);
  }, [initialValues]);

  if (!isOpen) return null;

  const canSubmit = Boolean(form.nexus.trim()) && Boolean(form.ai.trim());

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <header>
          <p className="section-title">Secure Session</p>
          <h2>Enter API keys</h2>
          <p>Your keys are stored in memory only and cleared when the tab closes.</p>
        </header>
        <label>
          <span>Nexus Mods API Key</span>
          <input
            type="password"
            value={form.nexus}
            onChange={(event) => setForm((prev) => ({ ...prev, nexus: event.target.value }))}
            placeholder="live_{...}"
          />
        </label>
        <label>
          <span>Gemini / GPT API Key</span>
          <input
            type="password"
            value={form.ai}
            onChange={(event) => setForm((prev) => ({ ...prev, ai: event.target.value }))}
            placeholder="AIza... or sk-..."
          />
        </label>
        <div className="modal-actions">
          <button type="button" className="ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" disabled={!canSubmit} onClick={() => canSubmit && onSubmit(form)}>
            Save Keys
          </button>
        </div>
      </div>
    </div>
  );
};
