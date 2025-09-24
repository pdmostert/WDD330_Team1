import { getLocalStorage, setLocalStorage, renderListWithTemplate, discount } from './utils.mjs';

function cartItemTemplate(item) {
  /* Change the following source file for the img to item.Images.PrimaryMedium */
  return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${item.Images?.PrimaryMedium}" alt="${item.Name}" />
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
//total cart logic in case we need to switch branches starts
function getDiscountedNumber(item) {
  const html = discount(item);                   
  const match = html.match(/class="new-price">\$([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
}
//total cart logic in case we need to switch branches ends
export default class ShoppingCart {
  constructor(listElement) {
    this.listElement = listElement;
    this.cartItems = this.getCartItems();
    //total cart logic in case we need to switch branches starts
    this.cartFooter = document.querySelector('.cart-footer');
    this.cartTotal = document.querySelector('.cart-total');
    //total cart logic in case we need to switch branches ends
  }

  getCartItems() {
    return getLocalStorage('so-cart') || [];
  }
  //total cart logic in case we need to switch branches starts
  calculateTotal() {
  return this.cartItems.reduce((sum, item) => sum + getDiscountedNumber(item), 0);
}

  renderTotal() {
    if (this.cartItems.length > 0) {
      this.cartFooter.classList.remove('hide');
      const total = this.calculateTotal().toFixed(2);
      this.cartTotal.textContent = `Total: $${total}`;
    } else {
      this.cartFooter.classList.add('hide');
    }
  }
  //total cart logic in case we need to switch branches ends
  renderCart() {
    this.listElement.innerHTML = '';
    renderListWithTemplate(cartItemTemplate, this.listElement, this.cartItems);
    this.addRemoveButtons();
    //total cart logic in case we need to switch branches starts
    this.renderTotal();
    //total cart logic in case we need to switch branches ends
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
