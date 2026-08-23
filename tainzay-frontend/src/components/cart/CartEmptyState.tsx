import Link from 'next/link';

export default function CartEmptyState() {
  return (
    <div className="cart-empty">
      <h2 className="cart-empty-title">Your cart is empty</h2>
      <p className="cart-empty-text">Browse the shop and add products to continue.</p>
      <div className="cart-empty-actions">
        <Link href="/products" className="cart-btn cart-btn-primary">
          Continue Shopping
        </Link>
        <Link href="/" className="cart-btn cart-btn-outline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
