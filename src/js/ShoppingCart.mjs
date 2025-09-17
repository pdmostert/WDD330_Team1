import { getLocalStorage, setLocalStorage, renderListWithTemplate, discount } from './utils.mjs';

function cartItemTemplate(item) {
  return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${item.Images.PrimaryMedium}" alt="${item.Name}" />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: 1</p>
    <div class="cart-card_price">
      ${discount(item)}
    </div>
    <button class="remove-cart-item cart-card__remove" id="${item.Id}" aria-label="Remove from cart">✕</button>
  </li>`;
}

export default class ShoppingCart {
  constructor(listElement) {
    this.listElement = listElement;
    this.cartItems = this.getCartItems();
  }

  getCartItems() {
    return getLocalStorage('so-cart') || [];
  }

    renderCart() {
    this.listElement.innerHTML = '';
    renderListWithTemplate(cartItemTemplate, this.listElement, this.cartItems);
    this.addRemoveButtons();
  }

  addRemoveButtons() {
    this.listElement.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-cart-item')) {
        const idToRemove = e.target.getAttribute('id');
        this.removeCartItem(idToRemove);
      }
    });
  }

  removeCartItem(id) {
    this.cartItems = this.cartItems.filter((item) => item.Id !== id);
    setLocalStorage('so-cart', this.cartItems);
    this.renderCart();
  }

  init() {
    this.renderCart();
  }
}
