import { getLocalStorage, setLocalStorage, discount } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }
  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();

    const addToCartBtn = document.getElementById('addToCart');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', this.addProductToCart.bind(this));
    }
  }

  addProductToCart() {
    const cartItems = getLocalStorage('so-cart') || []; // get cart array of items from local storage if null set to empty array
    cartItems.push(this.product);
    setLocalStorage('so-cart', cartItems);
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  document.querySelector('h2').textContent =
    product.Category.charAt(0).toUpperCase() + product.Category.slice(1);
  document.querySelector('#p-brand').textContent = product.Brand.Name;
  document.querySelector('#p-name').textContent = product.NameWithoutBrand;

  const productImage = document.querySelector('#p-image');
  productImage.src = product.Images.PrimaryExtraLarge;
  productImage.alt = product.NameWithoutBrand;
  const euroPrice = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(Number(product.FinalPrice) * 0.85);
  document.querySelector('#p-price').textContent = `${euroPrice}`;
  document.querySelector('#p-color').textContent = product.Colors[0].ColorName;
  document.querySelector('#p-description').innerHTML =
    product.DescriptionHtmlSimple;

  document.querySelector('#addToCart').dataset.id = product.Id;
}
