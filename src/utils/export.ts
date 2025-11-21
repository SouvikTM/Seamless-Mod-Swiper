import type { StoredModSummary } from '../context/SessionContext';

export const exportApprovedMods = (mods: StoredModSummary[], filename = 'approved-mods.txt') => {
  const header = '# Seamless Mod Swiper — Approved Mods\n';
  const lines = mods.map(
    (mod, index) =>
      `${index + 1}. ${mod.name} (by ${mod.author}) — Logic ${mod.logicScore}/100, AI ${mod.aiScore}/100 — ${mod.url} [target version: ${mod.version}]`,
  );
  const fileContents = `${header}\n${lines.join('\n')}`;
  const blob = new Blob([fileContents], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};
