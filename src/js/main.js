import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';

const productData = new ProductData("tents");
const listElement = document.querySelector('.product-list');

async function initProductList() {
  await productData.getData(); // Ensure data is loaded
  const productList = new ProductList('Tents', productData, listElement);
  productList.init();
}

initProductList();
