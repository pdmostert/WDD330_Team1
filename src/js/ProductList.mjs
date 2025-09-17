export default class ProductList {
  constructor(category, dataSource, element) {
    this.category = category;
    this.dataSource = dataSource;
    this.element = element;
  }

  async init() {
    const list = await this.dataSource.getData(this.category);
    this.render(list);
  }

  render(list) {
    this.element.innerHTML = list.map(product => this.productCard(product)).join('');
  }

  productCard(product) {
    return `
      <div class="product-card">
        <a href="../product_detail/index.html?id=${product.Id}">
          <img src="${product.PrimaryMedium?.Url || ''}" alt="${product.Name}" />
          <h3>${product.Name}</h3>
          <p>$${product.ListPrice}</p>
        </a>
      </div>
    `;
  }
}

    