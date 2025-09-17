import { renderListWithTemplate, discount } from './utils.mjs';

function productCardTemplate(product) {
  return `
    <li class="product-card">
      <a href="/product_pages/?product=${product.Id}">
        <img src="${product.Images.PrimaryMedium}" alt="${product.Name}">
        <h3>${product.Brand.Name}</h3>
        <p>${product.NameWithoutBrand}</p>
        ${discount(product)}
      </a>
    </li>
    `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData(this.category);
    this.renderList(list);
    document.querySelector('.title').textContent = this.category;
    this.sortList('name-asc');
  }

  renderList(list) {
    return renderListWithTemplate(productCardTemplate, this.listElement, list);
  }


  sortList(criteria) {
    const sortedList = [...this.listElement.children];
    sortedList.sort((a, b) => {
      if (criteria === 'name-asc' || criteria === 'name-desc') {
        const nameA = a.querySelector('p').textContent.toLowerCase();
        const nameB = b.querySelector('p').textContent.toLowerCase();
        return criteria === 'name-asc'
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      } else if (criteria === 'price-asc' || criteria === 'price-desc') {
        const priceA = parseFloat(
          a.querySelector('.new-price').textContent.replace('$', ''),
        );
        const priceB = parseFloat(
          b.querySelector('.new-price').textContent.replace('$', ''),
        );
        return criteria === 'price-asc' ? priceA - priceB : priceB - priceA;
      }
    });
    this.listElement.innerHTML = '';
    sortedList.forEach((item) => this.listElement.appendChild(item));
  }
}
