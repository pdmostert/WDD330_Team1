import { loadHeaderFooter } from './utils.mjs';

loadHeaderFooter();

// Handle newsletter form submit
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".newsletter-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = form.email.value.trim();
      if (email) {
        alert(`Thanks for subscribing, ${email}!`);
        form.reset();
      }
    });
  }
});

