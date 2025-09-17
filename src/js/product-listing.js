import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import { getParam, loadHeaderFooter } from './utils.mjs';


const category = getParam('category');
const dataSource = new ProductData();
const element = document.querySelector('.product-list');
const listing = new ProductList(category, dataSource, element);

document.querySelector('.sort-options').addEventListener('change', (event) => {
  const sortCriteria = event.target.value;
  listing.sortList(sortCriteria);
});

loadHeaderFooter();


listing.init();


