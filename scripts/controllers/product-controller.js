// Product Controller - Enhanced for Domino's-style pizza ordering
import productOperations from "../services/product-operations.js";

class ProductController {
    constructor() {
        this.products = [];
        this.init();
    }

    async init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.loadProducts();
            });
        } else {
            await this.loadProducts();
        }
    }

    // Load all products from API
    async loadProducts() {
        try {
            this.showLoading();
            
            const allProducts = await productOperations.loadProduct();
            this.products = this.enhanceProductData(allProducts);
            
            this.renderProducts();
            this.hideLoading();
            
        } catch (error) {
            console.error('Error loading products:', error);
            this.hideLoading();
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

        // Add more pizzas (non-vegetarian and specialty)
        const nonVegPizzas = [
            {
                id: 'pizza_nv_1',
                name: 'Chicken Supreme',
                description: 'Loaded with chicken chunks, onions, bell peppers and cheese',
                basePrice: 350,
                image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
                category: 'pizzas',
                type: 'non-vegetarian',
                isCustomizable: true
            },
            {
                id: 'pizza_nv_2',
                name: 'Pepperoni Classic',
                description: 'Classic pepperoni with mozzarella cheese and tangy sauce',
                basePrice: 380,
                image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop',
                category: 'pizzas',
                type: 'non-vegetarian',
                isCustomizable: true
            },
            {
                id: 'pizza_nv_3',
                name: 'BBQ Chicken',
                description: 'Grilled chicken with BBQ sauce, onions and bell peppers',
                basePrice: 420,
                image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&h=300&fit=crop',
                category: 'pizzas',
                type: 'non-vegetarian',
                isCustomizable: true
            },
            {
                id: 'pizza_nv_4',
                name: 'Meat Lovers',
                description: 'Pepperoni, sausage, chicken and ham with extra cheese',
                basePrice: 480,
                image: 'https://images.unsplash.com/photo-1606750291548-8aae9e842d9b?w=400&h=300&fit=crop',
                category: 'pizzas',
                type: 'non-vegetarian',
                isCustomizable: true
            },
            {
                id: 'pizza_sp_1',
                name: 'Margherita Deluxe',
                description: 'Fresh tomatoes, mozzarella, basil with premium cheese',
                basePrice: 320,
                image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=300&fit=crop',
                category: 'pizzas',
                type: 'specialty',
                isCustomizable: true
            },
            {
                id: 'pizza_sp_2',
                name: 'Four Cheese',
                description: 'Mozzarella, cheddar, parmesan and gouda cheese blend',
                basePrice: 450,
                image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
                category: 'pizzas',
                type: 'specialty',
                isCustomizable: true
            },
            {
                id: 'pizza_sp_3',
                name: 'Mediterranean',
                description: 'Olives, feta cheese, tomatoes, herbs and olive oil',
                basePrice: 380,
                image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&h=300&fit=crop',
                category: 'pizzas',
                type: 'specialty',
                isCustomizable: true
            }
        ];

        // Add comprehensive sides menu
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
            },
            {
                id: 'side_4',
                name: 'Loaded Potato Wedges',
                description: 'Crispy potato wedges with cheese, bacon bits and sour cream',
                basePrice: 200,
                image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
                category: 'sides',
                type: 'potato',
                isCustomizable: false
            },
            {
                id: 'side_5',
                name: 'Chicken Nuggets',
                description: '8 pieces of crispy golden chicken nuggets with dip',
                basePrice: 220,
                image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop',
                category: 'sides',
                type: 'chicken',
                isCustomizable: false
            },
            {
                id: 'side_6',
                name: 'Mozzarella Sticks',
                description: 'Golden fried mozzarella sticks with marinara sauce',
                basePrice: 240,
                image: 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=400&h=300&fit=crop',
                category: 'sides',
                type: 'cheese',
                isCustomizable: false
            },
            {
                id: 'side_7',
                name: 'Onion Rings',
                description: 'Crispy beer-battered onion rings with spicy mayo',
                basePrice: 160,
                image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=300&fit=crop',
                category: 'sides',
                type: 'vegetarian',
                isCustomizable: false
            },
            {
                id: 'side_8',
                name: 'Caesar Salad',
                description: 'Fresh romaine lettuce with caesar dressing and croutons',
                basePrice: 180,
                image: 'https://images.unsplash.com/photo-1512852939750-1305098529bf?w=400&h=300&fit=crop',
                category: 'sides',
                type: 'salad',
                isCustomizable: false
            },
            {
                id: 'side_9',
                name: 'Pasta Arrabiata',
                description: 'Spicy tomato pasta with herbs and parmesan cheese',
                basePrice: 280,
                image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop',
                category: 'sides',
                type: 'pasta',
                isCustomizable: false
            },
            {
                id: 'side_10',
                name: 'Stuffed Garlic Bread',
                description: 'Garlic bread stuffed with cheese and jalapeños',
                basePrice: 150,
                image: 'https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?w=400&h=300&fit=crop',
                category: 'sides',
                type: 'bread',
                isCustomizable: false
            }
        ];

        // Add comprehensive beverages menu
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
            },
            {
                id: 'bev_4',
                name: 'Pepsi',
                description: 'Classic Pepsi Cola - 500ml',
                basePrice: 60,
                image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop',
                category: 'beverages',
                type: 'soft_drink',
                isCustomizable: false
            },
            {
                id: 'bev_5',
                name: 'Orange Juice',
                description: 'Fresh squeezed orange juice - 300ml',
                basePrice: 90,
                image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop',
                category: 'beverages',
                type: 'fresh_juice',
                isCustomizable: false
            },
            {
                id: 'bev_6',
                name: 'Apple Juice',
                description: 'Pure apple juice - 300ml',
                basePrice: 90,
                image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=300&fit=crop',
                category: 'beverages',
                type: 'fresh_juice',
                isCustomizable: false
            },
            {
                id: 'bev_7',
                name: 'Iced Tea',
                description: 'Chilled lemon iced tea - 400ml',
                basePrice: 70,
                image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
                category: 'beverages',
                type: 'iced_tea',
                isCustomizable: false
            },
            {
                id: 'bev_8',
                name: 'Hot Coffee',
                description: 'Freshly brewed espresso coffee',
                basePrice: 80,
                image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
                category: 'beverages',
                type: 'hot_drink',
                isCustomizable: false
            },
            {
                id: 'bev_9',
                name: 'Chocolate Milkshake',
                description: 'Rich chocolate milkshake with whipped cream',
                basePrice: 120,
                image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop',
                category: 'beverages',
                type: 'milkshake',
                isCustomizable: false
            },
            {
                id: 'bev_10',
                name: 'Strawberry Smoothie',
                description: 'Fresh strawberry smoothie with yogurt',
                basePrice: 110,
                image: 'https://images.unsplash.com/photo-1553530979-67472925831c?w=400&h=300&fit=crop',
                category: 'beverages',
                type: 'smoothie',
                isCustomizable: false
            },
            {
                id: 'bev_11',
                name: 'Mineral Water',
                description: 'Purified mineral water - 1L',
                basePrice: 40,
                image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=300&fit=crop',
                category: 'beverages',
                type: 'water',
                isCustomizable: false
            },
            {
                id: 'bev_12',
                name: 'Energy Drink',
                description: 'Refreshing energy drink - 250ml',
                basePrice: 80,
                image: 'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=400&h=300&fit=crop',
                category: 'beverages',
                type: 'energy_drink',
                isCustomizable: false
            }
        ];

        // Add comprehensive desserts menu
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
            },
            {
                id: 'dessert_3',
                name: 'Cheesecake',
                description: 'New York style cheesecake with berry compote',
                basePrice: 200,
                image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop',
                category: 'desserts',
                type: 'cake',
                isCustomizable: false
            },
            {
                id: 'dessert_4',
                name: 'Chocolate Lava Cake',
                description: 'Warm chocolate cake with molten center and ice cream',
                basePrice: 170,
                image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&h=300&fit=crop',
                category: 'desserts',
                type: 'cake',
                isCustomizable: false
            },
            {
                id: 'dessert_5',
                name: 'Ice Cream Sundae',
                description: 'Three scoops of ice cream with nuts, sauce and cherry',
                basePrice: 120,
                image: 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=400&h=300&fit=crop',
                category: 'desserts',
                type: 'ice_cream',
                isCustomizable: false
            },
            {
                id: 'dessert_6',
                name: 'Apple Pie',
                description: 'Traditional apple pie with cinnamon and vanilla ice cream',
                basePrice: 160,
                image: 'https://images.unsplash.com/photo-1621743478914-cc8a86d7d055?w=400&h=300&fit=crop',
                category: 'desserts',
                type: 'pie',
                isCustomizable: false
            },
            {
                id: 'dessert_7',
                name: 'Donuts (6 pieces)',
                description: 'Assorted glazed donuts with various toppings',
                basePrice: 180,
                image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop',
                category: 'desserts',
                type: 'donut',
                isCustomizable: false
            },
            {
                id: 'dessert_8',
                name: 'Chocolate Mousse',
                description: 'Light and airy chocolate mousse with whipped cream',
                basePrice: 140,
                image: 'https://images.unsplash.com/photo-1541636603893-34fa5c6b4bb8?w=400&h=300&fit=crop',
                category: 'desserts',
                type: 'mousse',
                isCustomizable: false
            }
        ];

        // Add combo deals
        const combos = [
            {
                id: 'combo_1',
                name: 'Pizza Combo for 1',
                description: 'Personal pizza + side + beverage (Save ₹50)',
                basePrice: 350,
                image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&h=300&fit=crop',
                category: 'combos',
                type: 'single',
                isCustomizable: false
            },
            {
                id: 'combo_2',
                name: 'Family Feast',
                description: '2 Large pizzas + 2 sides + 4 beverages (Save ₹200)',
                basePrice: 1200,
                image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
                category: 'combos',
                type: 'family',
                isCustomizable: false
            },
            {
                id: 'combo_3',
                name: 'Date Night Special',
                description: '1 Large pizza + 2 sides + 2 beverages + dessert (Save ₹150)',
                basePrice: 800,
                image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&h=300&fit=crop',
                category: 'combos',
                type: 'couple',
                isCustomizable: false
            },
            {
                id: 'combo_4',
                name: 'Party Pack',
                description: '3 Large pizzas + 3 sides + 6 beverages (Save ₹300)',
                basePrice: 1800,
                image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop',
                category: 'combos',
                type: 'party',
                isCustomizable: false
            },
            {
                id: 'combo_5',
                name: 'Lunch Special',
                description: 'Personal pizza + salad + drink (Available 12-4 PM)',
                basePrice: 280,
                image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=300&fit=crop',
                category: 'combos',
                type: 'lunch',
                isCustomizable: false
            },
            {
                id: 'combo_6',
                name: 'Student Deal',
                description: 'Medium pizza + fries + soft drink (Show student ID)',
                basePrice: 320,
                image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
                category: 'combos',
                type: 'student',
                isCustomizable: false
            }
        ];

        enhanced.push(...nonVegPizzas, ...sides, ...beverages, ...desserts, ...combos);
        return enhanced;
    }

    // Render all products
    renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) {
            console.error('Products grid not found');
            return;
        }
        
        productsGrid.innerHTML = '';

        this.products.forEach(product => {
            const productCard = this.createProductCard(product);
            productsGrid.appendChild(productCard);
        });

        // Initialize animations after rendering
        this.animateProductCards();
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
        // Store current product globally so modal can access it
        window.currentProduct = product;
        
        // Update modal title
        const modalTitle = document.querySelector('#customizationModal .modal-title');
        if (modalTitle) {
            modalTitle.textContent = `Customize Your ${product.name}`;
        }
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('customizationModal'));
        modal.show();
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
        // Trigger custom event for cart to handle
        const event = new CustomEvent('addToCart', {
            detail: cartItem
        });
        window.dispatchEvent(event);
    }

    // Show error message
    showErrorMessage(message) {
        this.showNotification(message, 'error');
    }

    // Show loading overlay
    showLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('active');
        }
    }

    // Hide loading overlay
    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    // Show notification
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = 'success-message';
        if (type === 'error') {
            notification.style.backgroundColor = 'var(--danger-color)';
        }
        notification.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'} me-2"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Add product card animations
    animateProductCards() {
        const cards = document.querySelectorAll('.product-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, {
            threshold: 0.1
        });
        
        cards.forEach(card => {
            observer.observe(card);
        });
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
            desserts: [],
            combos: []
        };

        this.products.forEach(product => {
            if (categorized[product.category]) {
                categorized[product.category].push(product);
            }
        });

        return categorized;
    }
}

// Initialize product controller when DOM is ready
let productController;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        productController = new ProductController();
        window.productController = productController;
    });
} else {
    productController = new ProductController();
    window.productController = productController;
}

export default productController;