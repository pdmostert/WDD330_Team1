import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import {  getParam } from './utils.mjs';

const category = getParam('category');
const dataSource = new ProductData();
const element = document.querySelector('.product-list');
const listing = new ProductList(category, dataSource, element);

listing.init();
