/** First paragraph of product copy, trimmed for the header summary */
export function getDescriptionSummary(description: string, maxLength = 240): string {
  const trimmed = description.trim();
  if (!trimmed) return '';

  const firstParagraph = trimmed.split(/\n\s*\n/)[0]?.trim() ?? trimmed;
  if (firstParagraph.length <= maxLength) return firstParagraph;

  const shortened = firstParagraph.slice(0, maxLength).trim();
  const lastSpace = shortened.lastIndexOf(' ');
  const safeCut = lastSpace > maxLength * 0.6 ? shortened.slice(0, lastSpace) : shortened;

  return `${safeCut}…`;
}

/** Lines that look like bullet points inside the description */
export function getDescriptionBullets(description: string, limit = 4): string[] {
  return description
    .split(/\n/)
    .map((line) => line.trim())
    .filter((line) => /^[-•*]\s+/.test(line))
    .map((line) => line.replace(/^[-•*]\s+/, ''))
    .slice(0, limit);
}
