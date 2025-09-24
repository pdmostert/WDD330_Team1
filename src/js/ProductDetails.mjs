import { getLocalStorage, setLocalStorage, discount } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }
  async init() {
    // use the datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
    // the product details are needed before rendering the HTML
    // once the HTML is rendered, add a listener to the Add to Cart button
    // Notice the .bind(this). This callback will not work if the bind(this) is missing. Review the readings from this week on 'this' to understand why.
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
    const productContainer = document.querySelector('.product-detail');
    productContainer.innerHTML = `
      <h3>${this.product.Brand.Name || ''}</h3>
      <h2 class="divider">${this.product.NameWithoutBrand || ''}</h2>
      <img class="divider"
        src="${this.product.Images.PrimaryExtraLarge || ''}"
        alt="${this.product.Name || ''}" />
      ${discount(this.product)}
      <p class="product__color">${this.product.Colors[0].ColorName || ''}</p>
      <p class="product__description">
        ${this.product.DescriptionHtmlSimple || ''}
      </p>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${this.product.Id || ''}">Add to Cart</button>
      </div>
    `;
  }
}
