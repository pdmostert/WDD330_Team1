import ExternalServices from './ExternalServices.mjs';
import ProductList from './ProductList.mjs';
import { getParam, loadHeaderFooter } from './utils.mjs';


const category = getParam('category');
const dataSource = new ExternalServices();
const element = document.querySelector('.product-list');
const listing = new ProductList(category, dataSource, element);

document.querySelector('.sort-options').addEventListener('change', (event) => {
  const sortCriteria = event.target.value;
  listing.sortList(sortCriteria);
});

loadHeaderFooter();


listing.init();


