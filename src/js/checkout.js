import { loadHeaderFooter } from './utils.mjs';
import CheckoutProcess from './CheckoutProcess.mjs';
import ExternalServices from './ExternalServices.mjs';

loadHeaderFooter();

const myServices = new ExternalServices();
const myCheckout = new CheckoutProcess('so-cart', '.order-summary', myServices);
myCheckout.init();

async function checkoutFormHandler(e) {
  e.preventDefault();
//   console.log(e.target);
  myCheckout.checkout(e.target);
}

document.querySelector('.checkout-form').addEventListener('submit', checkoutFormHandler);
