import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext({
  cart: [],
  cartCount: 0,
  cartTotal: 0,
  addToCart: () => {},
  changeQuantity: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
});

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    async function loadCart() {
      try {
        const saved = await AsyncStorage.getItem('@ruang_rasa_cart');
        if (saved) {
          setCart(JSON.parse(saved));
        }
      } catch (_e) {
        // ignore
      }
    }
    loadCart();
  }, []);

  async function saveCart(newCart) {
    setCart(newCart);
    try {
      await AsyncStorage.setItem('@ruang_rasa_cart', JSON.stringify(newCart));
    } catch (_e) {
      // ignore
    }
  }

  function addToCart(product) {
    const existing = cart.find((item) => item.id === product.id);
    let nextCart;
    if (existing) {
      nextCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      nextCart = [...cart, { ...product, quantity: 1 }];
    }
    saveCart(nextCart);
  }

  function changeQuantity(id, quantity) {
    let nextCart;
    if (quantity < 1) {
      nextCart = cart.filter((item) => item.id !== id);
    } else {
      nextCart = cart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
    }
    saveCart(nextCart);
  }

  function removeFromCart(id) {
    const nextCart = cart.filter((item) => item.id !== id);
    saveCart(nextCart);
  }

  function clearCart() {
    saveCart([]);
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        addToCart,
        changeQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

