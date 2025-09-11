import { getLocalStorage, setLocalStorage, discount } from './utils.mjs';

function renderCartContents() {
  const cartItems = getLocalStorage('so-cart');
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector('.product-list').innerHTML = htmlItems.join('');
  addRemoveButtons();
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <div class="cart-card_price">
    ${discount(item)}
  </div>
    <button class="remove-cart-item cart-card__remove"  id="${item.Id}" aria-label="Remove from cart">✕</button>
</li>`;

  return newItem;
}

function addRemoveButtons() {
  document
    .querySelector('.product-list')
    .addEventListener('click', function (e) {
      if (e.target.classList.contains('remove-cart-item')) {
        const idToRemove = e.target.getAttribute('id');
        removeCartItem(idToRemove);
      }
    });
}

function removeCartItem(id) {
  const cartItems = getLocalStorage('so-cart');
  const updatedCart = cartItems.filter((item) => item.Id !== id);
  setLocalStorage('so-cart', updatedCart);
  renderCartContents();
}

renderCartContents();
