// cart.js
import { loadCart, saveCart } from "./utils.mjs";

// Add item to cart
export function addToCart(product) {
  const cart = loadCart();

  // If product exists, increase quantity
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  alert(`${product.name} added to cart!`);
}

// Get cart contents
export function getCart() {
  return loadCart();
}

// Remove one item by ID
export function removeFromCart(productId) {
  let cart = loadCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
}

// Clear cart
export function clearCart() {
  saveCart([]);
}
