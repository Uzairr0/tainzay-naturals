'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  CART_UPDATED_EVENT,
  addCartLine,
  getCartCount,
  readCart,
  removeCartLine,
  updateCartLineQuantity,
  type CartLine,
} from '@/lib/cart';

export function useCart() {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const sync = useCallback(() => {
    setLines(readCart());
  }, []);

  useEffect(() => {
    sync();
    setHydrated(true);

    const handleUpdate = () => sync();
    window.addEventListener(CART_UPDATED_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [sync]);

  const addItem = useCallback(
    (slug: string, quantity: number) => {
      setLines(addCartLine(slug, quantity));
    },
    [],
  );

  const setQuantity = useCallback((slug: string, quantity: number) => {
    setLines(updateCartLineQuantity(slug, quantity));
  }, []);

  const removeItem = useCallback((slug: string) => {
    setLines(removeCartLine(slug));
  }, []);

  const count = getCartCount(lines);

  return {
    lines,
    count,
    hydrated,
    addItem,
    setQuantity,
    removeItem,
    sync,
  };
}
