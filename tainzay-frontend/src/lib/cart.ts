export const CART_STORAGE_KEY = 'tainzay-cart';
export const CART_UPDATED_EVENT = 'tainzay-cart-updated';

export interface CartLine {
  slug: string;
  quantity: number;
}

function clampQuantity(value: number): number {
  if (!Number.isFinite(value) || value < 1) return 1;
  return Math.floor(value);
}

export function readCart(): CartLine[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as CartLine[];
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((line) => line?.slug && line.quantity > 0)
      .map((line) => ({
        slug: line.slug,
        quantity: clampQuantity(line.quantity),
      }));
  } catch {
    return [];
  }
}

export function writeCart(lines: CartLine[]) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
    window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
  } catch {
    // Ignore quota or privacy mode errors
  }
}

export function getCartCount(lines: CartLine[] = readCart()): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

export function addCartLine(slug: string, quantity: number) {
  const qty = clampQuantity(quantity);
  const lines = readCart();
  const existing = lines.find((line) => line.slug === slug);

  if (existing) {
    existing.quantity += qty;
  } else {
    lines.push({ slug, quantity: qty });
  }

  writeCart(lines);
  return lines;
}

export function updateCartLineQuantity(slug: string, quantity: number) {
  const qty = clampQuantity(quantity);
  const lines = readCart().map((line) =>
    line.slug === slug ? { ...line, quantity: qty } : line,
  );
  writeCart(lines);
  return lines;
}

export function removeCartLine(slug: string) {
  const lines = readCart().filter((line) => line.slug !== slug);
  writeCart(lines);
  return lines;
}

export function clearCart() {
  writeCart([]);
}
