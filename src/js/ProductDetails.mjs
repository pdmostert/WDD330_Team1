import { setLocalStorage } from './utils.mjs';

export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }

    async init() {
        console.log('ProductDetails init started'); // ADD THIS LINE
        
        this.product = await this.dataSource.findProductById(this.productId);
        console.log('Product data loaded:', this.product); // ADD THIS LINE
        
        this.renderProductDetails();
        console.log('Product details rendered'); // ADD THIS LINE
        
        // Debug code - check if button exists
        const addButton = document.getElementById('addToCart');
        console.log('Add to Cart button element:', addButton); // ADD THIS LINE
        
        if (addButton) {
            addButton.addEventListener('click', this.addToCart.bind(this));
            console.log('Event listener added to button'); // ADD THIS LINE
        } else {
            console.error('Could not find Add to Cart button!'); // ADD THIS LINE
        }
    }

    addToCart() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.Id === this.product.Id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.product.quantity = 1;
            cart.push(this.product);
        }

        setLocalStorage('cart', cart);
        alert(`${this.product.Name} added to cart!`);
    }

    renderProductDetails() {
        document.getElementById('product-name').textContent = this.product.Name;
        document.getElementById('product-image').src = this.product.Image;
        document.getElementById('product-image').alt = this.product.Name;
        document.getElementById('product-price').textContent = `$${this.product.FinalPrice}`;
        document.getElementById('product-color').textContent = `Color: ${this.product.Colors[0].ColorName}`;
        document.getElementById('product-description').textContent = this.product.Description;
    }
}