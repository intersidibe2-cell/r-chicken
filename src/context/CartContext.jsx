import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const CartContext = createContext();
const CART_KEY = 'rchicken_cart';

export function CartProvider({ children }) {
  // Init from localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const getItemKey = (item) =>
    `${item.id}-${item.selectedSize || 'default'}-${(item.selectedAddons || []).sort().join(',')}`;

  const addToCart = useCallback((item) => {
    setCartItems(prev => {
      const itemKey = getItemKey(item);
      const existing = prev.find(i => getItemKey(i) === itemKey);
      if (existing) {
        return prev.map(i =>
          getItemKey(i) === itemKey
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        );
      }
      return [...prev, { ...item, itemKey, quantity: item.quantity || 1 }];
    });
  }, []);

  const removeFromCart = useCallback((itemKey) => {
    setCartItems(prev => prev.filter(i => (i.itemKey || i.id) !== itemKey));
  }, []);

  const updateQuantity = useCallback((itemKey, quantity) => {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(i => (i.itemKey || i.id) !== itemKey));
    } else {
      setCartItems(prev =>
        prev.map(i => ((i.itemKey || i.id) === itemKey ? { ...i, quantity } : i))
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem(CART_KEY);
  }, []);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
