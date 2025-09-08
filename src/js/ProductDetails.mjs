export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }
  initialize() {}
  addProductToCart(product) {
    const cartItems = getLocalStorage('so-cart') || []; // get cart array of items from local storage if null set to empty array
    cartItems.push(product);
    setLocalStorage('so-cart', cartItems);
  }
  renderProductDetails() {}
}
