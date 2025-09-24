import { getParam, loadHeaderFooter  } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';
import ProductDetails from './ProductDetails.mjs';

const productId = getParam('product');
const dataSource = new ExternalServices('tents');


// console.log(productId);
// console.log(await dataSource.findProductById(productId));


const product = new ProductDetails(productId, dataSource);
product.init();

loadHeaderFooter();


/*function addProductToCart(product) {
  setLocalStorage('so-cart', product);
} */

// // add to cart button event handler
// async function addToCartHandler(e) {
//   const product = await dataSource.findProductById(e.target.dataset.id);
//   addProductToCart(product);
// }

// // add listener to Add to Cart button
// document
//   .getElementById('addToCart')
//   .addEventListener('click', addToCartHandler);
