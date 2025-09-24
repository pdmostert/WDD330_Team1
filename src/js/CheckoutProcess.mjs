import { getLocalStorage, setLocalStorage } from './utils.mjs';

function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    price: item.FinalPrice,
    name: item.Name,
    quantity: 1,
  }));
}

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

export default class CheckoutProcess {
  constructor(key, outputSelector, services) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
    this.services = services;
  }

  init() {
    this.list = getLocalStorage(this.key);
    this.calculateOrderTotal();
    this.calculateItemSummary();
  }

  calculateItemSummary() {
    this.itemTotal = this.list.reduce((sum, item) => sum + item.FinalPrice, 0);
    this.calculateOrderTotal(); // Now correctly called
  }

  calculateOrderTotal() {
    const taxRate = 0.06;
    const shippingFirstItem = 10;
    const shippingAdditionalItem = 2;

    this.tax = this.itemTotal * taxRate;
    
    this.shipping = shippingFirstItem + (this.list.length > 1 ? (this.list.length - 1) * shippingAdditionalItem : 0);
    
    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const subtotal = document.querySelector(`${this.outputSelector} #subtotal`);
    const shippingCost = document.querySelector(`${this.outputSelector} #shipping-cost`);
    const tax = document.querySelector(`${this.outputSelector} #tax-cost`);
    const orderTotal = document.querySelector(`${this.outputSelector} #total-cost`);
    const itemCount = document.querySelector(`${this.outputSelector} #item-count`);

    if (subtotal) subtotal.innerText = `$${this.itemTotal.toFixed(2)}`;
    if (shippingCost) shippingCost.innerText = `$${this.shipping.toFixed(2)}`;
    if (tax) tax.innerText = `$${this.tax.toFixed(2)}`;
    if (orderTotal) orderTotal.innerText = `$${this.orderTotal.toFixed(2)}`;
    if (itemCount) itemCount.innerText = `${this.list.length}`;
  }

  async checkout(form) {
    const order = formDataToJSON(form);
    
    order.orderDate = new Date().toISOString();
    order.orderTotal = this.orderTotal.toFixed(2);
    order.shipping = this.shipping.toFixed(2); // Fixed: Convert to string
    order.tax = this.tax.toFixed(2);
    order.items = packageItems(this.list);

    try {
      const res = await this.services.checkout(order);
      console.log('Order submitted:', res);
      // Handle success
      setLocalStorage(this.key, []); 
      window.location.href = '/index.html';
    } catch (err) {
      console.error('Error submitting order:', err);
      // Handle error
    }
  }
}