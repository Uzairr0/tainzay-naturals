/**
 * Builds the compact page list used by the listing pager.
 * Seven or fewer pages are shown in full; otherwise first, last, current and
 * neighbours stay visible with ellipses for the gaps.
 */
export function getVisiblePages(
  current: number,
  totalPages: number,
): Array<number | 'ellipsis'> {
  if (totalPages <= 1) return [1];
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const page = Math.min(Math.max(1, current), totalPages);
  const shown = new Set([1, totalPages, page, page - 1, page + 1]);

  if (page <= 3) {
    shown.add(2);
    shown.add(3);
    shown.add(4);
  }

  if (page >= totalPages - 2) {
    shown.add(totalPages - 3);
    shown.add(totalPages - 2);
    shown.add(totalPages - 1);
  }

  const sorted = [...shown]
    .filter((value) => value >= 1 && value <= totalPages)
    .sort((a, b) => a - b);

  const items: Array<number | 'ellipsis'> = [];
  for (const [index, value] of sorted.entries()) {
    if (index > 0 && value - sorted[index - 1] > 1) {
      items.push('ellipsis');
    }
    items.push(value);
  }

  return items;
}
