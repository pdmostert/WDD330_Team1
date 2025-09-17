import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import { loadHeaderFooter } from './utils.mjs';

const productData = new ProductData("tents");
const listElement = document.querySelector('.product-list');

async function initProductList() {
  await productData.getData();
  const productList = new ProductList('Tents', productData, listElement);
  productList.init();
}
loadHeaderFooter();
initProductList();

