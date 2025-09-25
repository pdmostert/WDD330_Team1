import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";


const form = document.querySelector("#checkout-form");
form.noValidate = true; // disable native constraint validation so JS submit handler always runs
const checkout = new CheckoutProcess("so-cart", "#order-summary");
checkout.init();
checkout.calculateOrderTotal();

document.querySelector("input[name='zip']").addEventListener("blur", () => {
  checkout.calculateOrderTotal();
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const myForm = document.forms[0];
  const chk_status = myForm.checkValidity();
  if (!chk_status) {
    myForm.reportValidity();
    return;
  }
  await checkout.checkout(form);
});
loadHeaderFooter();
