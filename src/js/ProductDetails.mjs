import { getLocalStorage, setLocalStorage, discount, alertMessage } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
    this.currentImageIndex = 0;
  }

  async init() {
    // use the datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
    // the product details are needed before rendering the HTML
    // once the HTML is rendered, add a listener to the Add to Cart button
    // Notice the .bind(this). This callback will not work if the bind(this) is missing. Review the readings from this week on 'this' to understand why.
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();

    const addToCartBtn = document.getElementById('addToCart');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', this.addProductToCart.bind(this));
    }
  }

  addProductToCart() {
    const cartItems = getLocalStorage('so-cart') || [];
    cartItems.push(this.product);
    setLocalStorage('so-cart', cartItems);

    alertMessage("✅ Item added to cart successfully!", true, 3000, "success");
  }

  // helper to safely extract a usable image URL string from PrimaryLarge or Src property
  getImageUrl(img) {
    if (!img) return '';
    if (typeof img === 'string') return img;
    return (
      img.PrimaryLarge ||
      img.Src ||
      ''
    );
  }

  // build an ordered array: primary (PrimaryLarge) first then Images.ExtraImages items
  getAllImages() {
    const imgs = this.product.Images || {};
    const out = [];

    const primary = this.getImageUrl(
      imgs.PrimaryLarge || imgs.PrimaryExtraLarge || imgs.Primary,
    );
    if (primary) out.push(primary);

    const extras = imgs.ExtraImages || [];
    if (Array.isArray(extras)) {
      extras.forEach((e) => {
        const url = this.getImageUrl(e);
        if (url && !out.includes(url)) out.push(url);
      });
    }

    return out;
  }

  renderProductDetails() {
    const productContainer = document.querySelector('.product-detail');
    if (!productContainer) return;

    const images = this.getAllImages();
    const mainImg = images[0] || '';

    // if multiple images, render simple carousel with prev/next and thumbnails
    const imageArea =
      images.length > 1
        ? `
      <div class="product-image-carousel">
        <button class="carousel-btn carousel-prev" aria-label="Previous image">‹</button>
        <img id="productMainImage" src="${mainImg}" alt="${this.product.Name || ''}" />
        <button class="carousel-btn carousel-next" aria-label="Next image">›</button>
      </div>
      <div class="product-thumbs" role="list">
        ${images
          .map(
            (src, i) => `
          <button class="thumb ${i === 0 ? 'selected' : ''}" data-index="${i}" aria-label="Image ${
            i + 1
          }" role="listitem">
            <img src="${src}" alt="${this.product.Name || ''} - ${i + 1}" />
          </button>`,
          )
          .join('')}
      </div>
    `
        : `<img class="divider" id="productMainImage" src="${mainImg}" alt="${
            this.product.Name || ''
          }" />`;

    productContainer.innerHTML = `
      <h3>${this.product.Brand?.Name || ''}</h3>
      <h2 class="divider">${this.product.NameWithoutBrand || ''}</h2>
      ${imageArea}
      ${discount(this.product)}
      <p class="product__color">${this.product.Colors?.[0]?.ColorName || ''}</p>
      <p class="product__description">
        ${this.product.DescriptionHtmlSimple || ''}
      </p>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${this.product.Id || ''}">Add to Cart</button>
      </div>
    `;

    this.setupImageCarousel(images);
  }

  setupImageCarousel(images) {
    if (!images || images.length <= 1) return;

    this.currentImageIndex = 0;
    const mainImage = document.getElementById('productMainImage');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const thumbsContainer = document.querySelector('.product-thumbs');

    const updateMainImage = (index, { userInteraction = false } = {}) => {
      this.currentImageIndex = (index + images.length) % images.length;
      const url = images[this.currentImageIndex];
      if (mainImage) mainImage.src = url;

      if (thumbsContainer) {
        const prev = thumbsContainer.querySelector('.thumb.selected');
        if (prev) prev.classList.remove('selected');
        const next = thumbsContainer.querySelector(
          `.thumb[data-index="${this.currentImageIndex}"]`,
        );
        if (next) next.classList.add('selected');
      }

      // No autoplay — userInteraction has no autoplay side-effects
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () =>
        updateMainImage(this.currentImageIndex - 1, { userInteraction: true }),
      );
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () =>
        updateMainImage(this.currentImageIndex + 1, { userInteraction: true }),
      );
    }

    if (thumbsContainer) {
      thumbsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.thumb');
        if (!btn) return;
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        if (!Number.isNaN(idx)) updateMainImage(idx, { userInteraction: true });
      });
    }
  }
}
