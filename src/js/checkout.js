import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";


const form = document.querySelector("#checkout-form");
const checkout = new CheckoutProcess("so-cart", "#order-summary");
checkout.init();
checkout.calculateOrderTotal();

document.querySelector("input[name='zip']").addEventListener("blur", () => {
  checkout.calculateOrderTotal();
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  await checkout.checkout(form);
});
loadHeaderFooter();