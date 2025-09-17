import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import { loadHeaderFooter, getParam } from './utils.mjs';

loadHeaderFooter();

const category = getParam('category');
const productData = new ProductData();
const listElement = document.querySelector('.product-list');

const myList = new ProductList(category, productData, listElement);

myList.init();