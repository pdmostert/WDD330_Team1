import { getParam } from './utils.mjs';
import ProductData from './ProductData.mjs'; // Should be "from './ProductData.mjs'"
import ProductDetails from './ProductDetails.mjs'; // Should be "from './ProductDetails.mjs'"

const productId = getParam('product');
const dataSource = new ProductData('tents');

const product = new ProductDetails(productId, dataSource);
product.init();