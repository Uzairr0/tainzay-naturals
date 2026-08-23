/** Prices are quoted in PKR throughout the catalogue */
export function formatPrice(amount: number) {
  return `Rs.${amount.toLocaleString('en-PK')}`;
}
