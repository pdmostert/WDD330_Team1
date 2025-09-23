import { getLocalStorage, discount } from './utils.mjs';

function getDiscountedNumber(item) {
  const html = discount(item);                   
  const match = html.match(/class="new-price">\$([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.totalItems = 0;
    this.tax = 0;
    this.shipping = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key);
    this.calculateItemSummary();
  }

  calculateSubtotal() {
    this.itemTotal = this.list.reduce((sum, item) => {
      return sum + getDiscountedNumber(item) * item.quantity;
    }, 0);
  }

  calculateItemSummary() {
    this.calculateSubtotal();

    this.totalItems = this.list.reduce((sum, item) => sum + item.quantity, 0);

    const subtotalElem = document.querySelector(`${this.outputSelector} #subtotal`);
    if (subtotalElem) {
      subtotalElem.innerText = `$${this.itemTotal.toFixed(2)}`;
    }

    const itemCountElem = document.querySelector(`${this.outputSelector} #item-count`);
    if (itemCountElem) {
      itemCountElem.innerText = `${this.totalItems} item${this.totalItems !== 1 ? 's' : ''}`;
    }
  }

  calculateOrderTotal() {
    this.calculateItemSummary();

    this.tax = this.itemTotal * 0.06;
    this.shipping = this.totalItems > 0 ? 10 + (this.totalItems - 1) * 2 : 0;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const tax = document.querySelector(`${this.outputSelector} #tax`);
    const shipping = document.querySelector(`${this.outputSelector} #shipping`);
    const total = document.querySelector(`${this.outputSelector} #order-total`);

    if (tax) tax.innerText = `$${this.tax.toFixed(2)}`;
    if (shipping) shipping.innerText = `$${this.shipping.toFixed(2)}`;
    if (total) total.innerText = `$${this.orderTotal.toFixed(2)}`;
  }
}
