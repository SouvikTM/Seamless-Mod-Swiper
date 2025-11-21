const punctuationRegex = /[.,/#!$%^&*;:{}=\-_`~()\[\]"]/g;

export function normalizeText(value: string): string {
  return value.toLowerCase().replace(punctuationRegex, ' ');
}

export function containsPhrase(source: string, phrases: string[]): boolean {
  const haystack = normalizeText(source);
  return phrases.some((phrase) => haystack.includes(phrase.toLowerCase()));
}

export function countPhraseMatches(source: string, phrases: string[]): number {
  const haystack = normalizeText(source);
  return phrases.reduce((count, phrase) => count + (haystack.includes(phrase.toLowerCase()) ? 1 : 0), 0);
}

export function extractSnippet(text: string, limit = 280): string {
  if (!text) return '';
  if (text.length <= limit) return text;
  return `${text.slice(0, limit - 3).trim()}...`;
}
