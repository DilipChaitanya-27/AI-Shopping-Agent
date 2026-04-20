export function parseIntent(text) {
  if (!text) return {};

  const lower = text.toLowerCase();

  const underMatch = lower.match(/under\s?₹?\s?(\d+)/);
  const aboveMatch = lower.match(/(above|over)\s?₹?\s?(\d+)/);

  const maxBudget = underMatch ? Number(underMatch[1]) : null;
  const minBudget = aboveMatch ? Number(aboveMatch[2]) : null;

  return {
    minBudget,
    maxBudget,
  };
}