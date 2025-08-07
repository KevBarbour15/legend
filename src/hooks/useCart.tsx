"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// Cart item type
type CartItem = {
  variantId: string;
  title: string;
  image?: string;
  price: number;
  quantity: number;
  quantityAvailable?: number; // Store the available quantity when item is added
  variantTitle?: string; // Store the variant title (e.g., "Small", "Medium", "Large")
  selectedOptions?: { name: string; value: string }[]; // Store variant options
};

// Cart context type
interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "legend_cart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    }
    return [];
  });

  useEffect(() => {
    console.log("CartProvider items:", items);
  }, [items]);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (
    item: Omit<CartItem, "quantity">,
    quantity: number = 1,
    onAdd?: () => void,
  ) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === item.variantId);
      let updated;
      if (existing) {
        updated = prev.map((i) =>
          i.variantId === item.variantId
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      } else {
        updated = [...prev, { ...item, quantity }];
      }
      if (onAdd) setTimeout(onAdd, 0);
      return updated;
    });
  };

  const removeFromCart = (variantId: string) => {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.variantId === variantId ? { ...i, quantity } : i))
        .filter((i) => i.quantity > 0),
    );
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};
