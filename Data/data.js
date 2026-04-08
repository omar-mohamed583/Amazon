export { products } from './products.js';
export { calcPrice } from './priceCalcution.js';

export let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];

export function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}
