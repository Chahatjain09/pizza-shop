// Cart Service - Handles cart business logic
class CartService {
    constructor() {
        this.items = [];
        this.deliveryCharge = 40;
        this.taxRate = 0.18; // 18% GST
        this.freeDeliveryThreshold = 500;
    }

    // Add item to cart
    addItem(item) {
        try {
            // Generate unique ID for cart item
            const cartItemId = this.generateCartItemId(item);
            
            // Check if item with same customizations already exists
            const existingItem = this.items.find(cartItem => 
                cartItem.id === cartItemId
            );

            if (existingItem) {
                // Update quantity if item already exists
                existingItem.quantity += item.quantity || 1;
                existingItem.totalPrice = this.calculateItemTotal(existingItem);
            } else {
                // Add new item to cart
                const cartItem = {
                    id: cartItemId,
                    productId: item.productId,
                    name: item.name,
                    image: item.image,
                    basePrice: item.basePrice,
                    quantity: item.quantity || 1,
                    customizations: item.customizations || {},
                    totalPrice: this.calculateItemTotal(item)
                };
                
                this.items.push(cartItem);
            }
            
            return true;
        } catch (error) {
            console.error('Error adding item to cart:', error);
            return false;
        }
    }

    // Generate unique ID for cart item based on product and customizations
    generateCartItemId(item) {
        const customizations = item.customizations || {};
        const customizationString = JSON.stringify(customizations);
        return `${item.productId}_${btoa(customizationString)}`;
    }

    // Calculate total price for an item including customizations
    calculateItemTotal(item) {
        let total = item.basePrice;
        const customizations = item.customizations || {};
        
        // Add size price
        if (customizations.size) {
            const sizePrice = this.getSizePrice(customizations.size);
            total += sizePrice;
        }
        
        // Add crust price
        if (customizations.crust) {
            const crustPrice = this.getCrustPrice(customizations.crust);
            total += crustPrice;
        }
        
        // Add toppings price
        if (customizations.toppings && customizations.toppings.length > 0) {
            const toppingsPrice = this.getToppingsPrice(customizations.toppings);
            total += toppingsPrice;
        }
        
        return total * (item.quantity || 1);
    }

    // Get size price modifier
    getSizePrice(size) {
        const sizePrices = {
            'small': 0,
            'medium': 100,
            'large': 200
        };
        return sizePrices[size] || 0;
    }

    // Get crust price modifier
    getCrustPrice(crust) {
        const crustPrices = {
            'thin': 0,
            'thick': 50,
            'stuffed': 100
        };
        return crustPrices[crust] || 0;
    }

    // Get toppings price
    getToppingsPrice(toppings) {
        const toppingPrices = {
            'extraCheese': 60,
            'mushrooms': 40,
            'pepperoni': 80,
            'olives': 30,
            'bellPeppers': 35,
            'onions': 25
        };
        
        return toppings.reduce((total, topping) => {
            return total + (toppingPrices[topping] || 0);
        }, 0);
    }

    // Remove item from cart
    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
    }

    // Update item quantity
    updateQuantity(itemId, quantity) {
        const item = this.items.find(item => item.id === itemId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            item.totalPrice = this.calculateItemTotal(item);
        }
    }

    // Get item by ID
    getItem(itemId) {
        return this.items.find(item => item.id === itemId);
    }

    // Get all items
    getItems() {
        return [...this.items];
    }

    // Get total number of items
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Get subtotal (sum of all item prices)
    getSubtotal() {
        return this.items.reduce((total, item) => total + item.totalPrice, 0);
    }

    // Get delivery charge
    getDeliveryCharge() {
        const subtotal = this.getSubtotal();
        return subtotal >= this.freeDeliveryThreshold ? 0 : this.deliveryCharge;
    }

    // Get tax amount
    getTax() {
        const subtotal = this.getSubtotal();
        return subtotal * this.taxRate;
    }

    // Get total amount
    getTotal() {
        return this.getSubtotal() + this.getDeliveryCharge() + this.getTax();
    }

    // Clear cart
    clearCart() {
        this.items = [];
    }

    // Load items from storage
    loadItems(items) {
        this.items = items || [];
    }

    // Get cart summary
    getCartSummary() {
        return {
            items: this.getItems(),
            totalItems: this.getTotalItems(),
            subtotal: this.getSubtotal(),
            deliveryCharge: this.getDeliveryCharge(),
            tax: this.getTax(),
            total: this.getTotal()
        };
    }

    // Check if cart is empty
    isEmpty() {
        return this.items.length === 0;
    }

    // Get item count by category
    getItemCountByCategory() {
        const categories = {};
        this.items.forEach(item => {
            const category = item.category || 'Other';
            categories[category] = (categories[category] || 0) + item.quantity;
        });
        return categories;
    }

    // Apply discount/coupon
    applyDiscount(discountCode) {
        // Placeholder for discount logic
        const discounts = {
            'SAVE10': 0.10,
            'FIRSTORDER': 0.15,
            'STUDENT': 0.20
        };
        
        if (discounts[discountCode]) {
            return {
                code: discountCode,
                percentage: discounts[discountCode],
                amount: this.getSubtotal() * discounts[discountCode]
            };
        }
        
        return null;
    }

    // Validate cart for checkout
    validateCart() {
        const errors = [];
        
        if (this.isEmpty()) {
            errors.push('Cart is empty');
        }
        
        if (this.getTotal() < 0) {
            errors.push('Invalid total amount');
        }
        
        // Check if any item has invalid quantity
        this.items.forEach(item => {
            if (item.quantity <= 0) {
                errors.push(`Invalid quantity for ${item.name}`);
            }
        });
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Get estimated delivery time
    getEstimatedDeliveryTime() {
        const baseTime = 30; // minutes
        const itemCount = this.getTotalItems();
        const additionalTime = Math.floor(itemCount / 5) * 5; // 5 minutes per 5 items
        
        return Math.min(baseTime + additionalTime, 60); // Max 60 minutes
    }

    // Get order preparation details
    getOrderPreparationDetails() {
        const categories = this.getItemCountByCategory();
        const estimatedTime = this.getEstimatedDeliveryTime();
        
        return {
            categories: categories,
            estimatedTime: estimatedTime,
            preparationSteps: [
                'Order received',
                'Preparing ingredients',
                'Cooking/Baking',
                'Quality check',
                'Packaging',
                'Out for delivery'
            ]
        };
    }
}

export default CartService;