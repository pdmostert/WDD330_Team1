import { loadHeaderFooter } from './utils.mjs';
import ShoppingCart from './ShoppingCart.mjs';

loadHeaderFooter();

const cartElement = document.querySelector('.product-list');
const cart = new ShoppingCart(cartElement);
cart.init();

// const cart = new ShoppingCart(document.querySelector('.product-list'));
