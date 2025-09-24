import { getLocalStorage, discount } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';

function getDiscountedNumber(item) {
  const html = discount(item);                   
  const match = html.match(/class="new-price">\$([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
}

function formDataToJSON(formElement) {
  const formData = new FormData(formElement),
    convertedJSON = {};

  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });

  return convertedJSON;
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
      const qty = item.quantity || 1;
      return sum + getDiscountedNumber(item) * qty;
    }, 0);
  }

  calculateItemSummary() {
    this.calculateSubtotal();

    this.totalItems = this.list.reduce((sum, item) => sum + (item.quantity || 1), 0);

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

    packageItems(items) {
    return items.map(item => ({
      id: item.Id,
      name: item.Name,
      price: parseFloat(item.FinalPrice),
      quantity: item.quantity
    }));
  }

  async checkout(form) {
    const order = formDataToJSON(form);
    if (order.expiration) {
  const [year, month] = order.expiration.split("-");
  const shortYear = year.slice(-2);
  const trimmedMonth = month.replace(/^0/, "");
  order.expiration = `${trimmedMonth}/${shortYear}`;
}
    order.orderDate = new Date().toISOString();
    order.orderTotal = this.orderTotal.toFixed(2);
    order.tax = this.tax.toFixed(2);
    order.shipping = this.shipping;
    order.items = this.packageItems(this.list);

      try {
        console.log("Sending order:", order);

      const service = new ExternalServices();
      await service.sendData(order);
      const response = await service.sendData(order);
      console.log("Order submitted:", response);
    } catch (err) {
      console.error("Checkout failed:", err);
    }
  }
}
