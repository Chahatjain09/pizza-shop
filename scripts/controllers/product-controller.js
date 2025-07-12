// Product Controller - Enhanced for Domino's-style pizza ordering
import productOperations from "../services/product-operations.js";
import UIController from "./ui-controller.js";

class ProductController {
    constructor() {
        this.products = [];
        this.uiController = new UIController();
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.uiController.initializeUI();
    }

    // Load all products from API
    async loadProducts() {
        try {
            this.uiController.showLoading();
            
            const allProducts = await productOperations.loadProduct();
            this.products = this.enhanceProductData(allProducts);
            
            this.renderProducts();
            this.uiController.hideLoading();
            
        } catch (error) {
            console.error('Error loading products:', error);
            this.uiController.hideLoading();
            this.showErrorMessage('Failed to load products. Please refresh the page.');
        }
    }

    // Enhance product data with additional properties
    enhanceProductData(products) {
        const enhanced = [];
        
        // Add pizzas
        if (products.Vegetarian) {
            products.Vegetarian.forEach(pizza => {
                enhanced.push({
                    id: pizza.id,
                    name: pizza.name,
                    description: pizza.menu_description,
                    basePrice: pizza.price,
                    image: pizza.assets.product_details_page[0].url,
                    category: 'pizzas',
                    type: 'vegetarian',
                    isCustomizable: true
                });
            });
        }

        // Add sides (mock data)
        const sides = [
            {
                id: 'side_1',
                name: 'Garlic Bread',
                description: 'Fresh baked bread with garlic butter and herbs',
                basePrice: 120,
                image: 'https://images.unsplash.com/photo-1549973890-38d08b229439?w=400&h=300&fit=crop',
                category: 'sides',
                type: 'bread',
                isCustomizable: false
            },
            {
                id: 'side_2',
                name: 'Cheesy Breadsticks',
                description: 'Crispy breadsticks loaded with mozzarella cheese',
                basePrice: 180,
                image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
                category: 'sides',
                type: 'bread',
                isCustomizable: false
            },
            {
                id: 'side_3',
                name: 'Buffalo Wings',
                description: 'Spicy chicken wings with buffalo sauce',
                basePrice: 250,
                image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&h=300&fit=crop',
                category: 'sides',
                type: 'chicken',
                isCustomizable: false
            }
        ];

        // Add beverages (mock data)
        const beverages = [
            {
                id: 'bev_1',
                name: 'Coca Cola',
                description: 'Classic Coca Cola - 500ml',
                basePrice: 60,
                image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=300&fit=crop',
                category: 'beverages',
                type: 'soft_drink',
                isCustomizable: false
            },
            {
                id: 'bev_2',
                name: 'Fresh Lime Soda',
                description: 'Refreshing lime soda with mint',
                basePrice: 80,
                image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop',
                category: 'beverages',
                type: 'fresh_drink',
                isCustomizable: false
            },
            {
                id: 'bev_3',
                name: 'Mango Lassi',
                description: 'Creamy mango yogurt drink',
                basePrice: 100,
                image: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400&h=300&fit=crop',
                category: 'beverages',
                type: 'lassi',
                isCustomizable: false
            }
        ];

        // Add desserts (mock data)
        const desserts = [
            {
                id: 'dessert_1',
                name: 'Chocolate Brownie',
                description: 'Rich chocolate brownie with vanilla ice cream',
                basePrice: 150,
                image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop',
                category: 'desserts',
                type: 'brownie',
                isCustomizable: false
            },
            {
                id: 'dessert_2',
                name: 'Tiramisu',
                description: 'Classic Italian dessert with coffee and mascarpone',
                basePrice: 180,
                image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
                category: 'desserts',
                type: 'cake',
                isCustomizable: false
            }
        ];

        enhanced.push(...sides, ...beverages, ...desserts);
        return enhanced;
    }

    // Render all products
    renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        productsGrid.innerHTML = '';

        this.products.forEach(product => {
            const productCard = this.createProductCard(product);
            productsGrid.appendChild(productCard);
        });
    }

    // Create product card HTML
    createProductCard(product) {
        const colDiv = document.createElement('div');
        colDiv.className = 'col-lg-4 col-md-6 col-sm-12 mb-4';

        const cardDiv = document.createElement('div');
        cardDiv.className = 'product-card card h-100';
        cardDiv.dataset.category = product.category;

        cardDiv.innerHTML = `
            <img src="${product.image}" class="card-img-top" alt="${product.name}">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">${product.description}</p>
                <div class="price mb-3">₹${product.basePrice}</div>
                <div class="mt-auto">
                    ${product.isCustomizable ? `
                        <div class="btn-group w-100" role="group">
                            <button class="btn btn-outline-primary customize-btn" 
                                    data-product-id="${product.id}">
                                <i class="fas fa-cog me-2"></i>Customize
                            </button>
                            <button class="btn btn-primary quick-add-btn" 
                                    data-product-id="${product.id}">
                                <i class="fas fa-plus me-2"></i>Add
                            </button>
                        </div>
                    ` : `
                        <button class="btn btn-primary w-100 add-to-cart-btn" 
                                data-product-id="${product.id}">
                            <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                        </button>
                    `}
                </div>
            </div>
        `;

        // Add event listeners
        this.bindProductCardEvents(cardDiv, product);

        colDiv.appendChild(cardDiv);
        return colDiv;
    }

    // Bind events to product card
    bindProductCardEvents(cardDiv, product) {
        // Customize button
        const customizeBtn = cardDiv.querySelector('.customize-btn');
        if (customizeBtn) {
            customizeBtn.addEventListener('click', () => {
                this.showCustomizationModal(product);
            });
        }

        // Quick add button
        const quickAddBtn = cardDiv.querySelector('.quick-add-btn');
        if (quickAddBtn) {
            quickAddBtn.addEventListener('click', () => {
                this.quickAddToCart(product);
            });
        }

        // Direct add to cart button
        const addToCartBtn = cardDiv.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                this.addToCart(product);
            });
        }
    }

    // Show customization modal
    showCustomizationModal(product) {
        this.uiController.showCustomizationModal(product);
    }

    // Quick add to cart with default options
    quickAddToCart(product) {
        const cartItem = {
            productId: product.id,
            name: product.name,
            image: product.image,
            basePrice: product.basePrice,
            quantity: 1,
            customizations: {
                size: 'medium',
                crust: 'thin',
                toppings: []
            }
        };

        this.addToCartWithAnimation(cartItem);
    }

    // Add product to cart
    addToCart(product) {
        const cartItem = {
            productId: product.id,
            name: product.name,
            image: product.image,
            basePrice: product.basePrice,
            quantity: 1,
            customizations: {}
        };

        this.addToCartWithAnimation(cartItem);
    }

    // Add to cart with animation
    addToCartWithAnimation(cartItem) {
        // Import cart controller dynamically to avoid circular dependency
        import('./cart-controller.js').then(module => {
            module.default.addToCart(cartItem);
        });
    }

    // Show error message
    showErrorMessage(message) {
        this.uiController.showErrorNotification(message);
    }

    // Get product by ID
    getProductById(productId) {
        return this.products.find(product => product.id === productId);
    }

    // Filter products by category
    filterProducts(category) {
        return this.products.filter(product => 
            category === 'all' || product.category === category
        );
    }

    // Search products
    searchProducts(query) {
        const lowercaseQuery = query.toLowerCase();
        return this.products.filter(product => 
            product.name.toLowerCase().includes(lowercaseQuery) ||
            product.description.toLowerCase().includes(lowercaseQuery)
        );
    }

    // Get products by category
    getProductsByCategory() {
        const categorized = {
            pizzas: [],
            sides: [],
            beverages: [],
            desserts: []
        };

        this.products.forEach(product => {
            if (categorized[product.category]) {
                categorized[product.category].push(product);
            }
        });

        return categorized;
    }
}

// Initialize product controller
const productController = new ProductController();
export default productController;