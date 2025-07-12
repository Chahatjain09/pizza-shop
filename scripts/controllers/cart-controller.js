// Cart Controller - Handles all cart-related functionality
import CartService from '../services/cart-service.js';
import UIController from './ui-controller.js';

class CartController {
    constructor() {
        this.cartService = new CartService();
        this.uiController = new UIController();
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadCartFromStorage();
        this.updateCartUI();
    }

    bindEvents() {
        // Cart toggle button
        document.getElementById('cartToggle').addEventListener('click', () => {
            this.toggleCart();
        });

        // Close cart button
        document.getElementById('closeCart').addEventListener('click', () => {
            this.closeCart();
        });

        // Clear cart button
        document.getElementById('clearCart').addEventListener('click', () => {
            this.clearCart();
        });

        // Checkout button
        document.getElementById('checkoutBtn').addEventListener('click', () => {
            this.proceedToCheckout();
        });

        // Close cart when clicking outside
        document.addEventListener('click', (e) => {
            const cartSidebar = document.getElementById('cartSidebar');
            const cartToggle = document.getElementById('cartToggle');
            
            if (!cartSidebar.contains(e.target) && !cartToggle.contains(e.target)) {
                this.closeCart();
            }
        });
    }

    // Add item to cart
    addToCart(item) {
        try {
            const success = this.cartService.addItem(item);
            
            if (success) {
                this.updateCartUI();
                this.saveCartToStorage();
                this.showSuccessMessage(`${item.name} added to cart!`);
                this.animateCartBadge();
                
                // Auto-open cart briefly to show the addition
                this.toggleCart();
                setTimeout(() => {
                    if (this.cartService.getTotalItems() > 1) {
                        this.closeCart();
                    }
                }, 2000);
            }
        } catch (error) {
            console.error('Error adding item to cart:', error);
            this.showErrorMessage('Failed to add item to cart');
        }
    }

    // Remove item from cart
    removeFromCart(itemId) {
        try {
            this.cartService.removeItem(itemId);
            this.updateCartUI();
            this.saveCartToStorage();
            this.showSuccessMessage('Item removed from cart');
        } catch (error) {
            console.error('Error removing item from cart:', error);
            this.showErrorMessage('Failed to remove item from cart');
        }
    }

    // Update item quantity
    updateQuantity(itemId, quantity) {
        try {
            if (quantity <= 0) {
                this.removeFromCart(itemId);
                return;
            }
            
            this.cartService.updateQuantity(itemId, quantity);
            this.updateCartUI();
            this.saveCartToStorage();
        } catch (error) {
            console.error('Error updating quantity:', error);
            this.showErrorMessage('Failed to update quantity');
        }
    }

    // Clear entire cart
    clearCart() {
        if (this.cartService.getTotalItems() === 0) {
            this.showErrorMessage('Cart is already empty');
            return;
        }

        if (confirm('Are you sure you want to clear your cart?')) {
            this.cartService.clearCart();
            this.updateCartUI();
            this.saveCartToStorage();
            this.showSuccessMessage('Cart cleared successfully');
        }
    }

    // Toggle cart sidebar
    toggleCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        cartSidebar.classList.toggle('active');
        
        if (cartSidebar.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }

    // Close cart sidebar
    closeCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        cartSidebar.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Update cart UI
    updateCartUI() {
        this.updateCartCount();
        this.updateCartItems();
        this.updateCartTotals();
        this.updateCheckoutButton();
    }

    // Update cart count badge
    updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        const totalItems = this.cartService.getTotalItems();
        cartCount.textContent = totalItems;
        
        if (totalItems > 0) {
            cartCount.style.display = 'inline-block';
        } else {
            cartCount.style.display = 'none';
        }
    }

    // Update cart items display
    updateCartItems() {
        const cartItems = document.getElementById('cartItems');
        const items = this.cartService.getItems();
        
        if (items.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart text-center py-4">
                    <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                    <p class="text-muted">Your cart is empty</p>
                    <p class="small text-muted">Add some delicious items to get started!</p>
                </div>
            `;
            return;
        }

        cartItems.innerHTML = items.map(item => this.createCartItemHTML(item)).join('');
        
        // Bind quantity update events
        this.bindQuantityEvents();
    }

    // Create cart item HTML
    createCartItemHTML(item) {
        const customizations = item.customizations || {};
        const customizationText = this.formatCustomizations(customizations);
        
        return `
            <div class="cart-item" data-item-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    ${customizationText ? `<div class="cart-item-customizations">${customizationText}</div>` : ''}
                    <div class="cart-item-price">₹${item.totalPrice.toFixed(2)}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="btn btn-sm btn-outline-secondary decrease-qty" data-item-id="${item.id}">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="btn btn-sm btn-outline-secondary increase-qty" data-item-id="${item.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger remove-item" data-item-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    // Format customizations for display
    formatCustomizations(customizations) {
        const parts = [];
        
        if (customizations.size) {
            parts.push(`${customizations.size} size`);
        }
        if (customizations.crust) {
            parts.push(`${customizations.crust} crust`);
        }
        if (customizations.toppings && customizations.toppings.length > 0) {
            parts.push(`+${customizations.toppings.join(', ')}`);
        }
        
        return parts.join(', ');
    }

    // Bind quantity control events
    bindQuantityEvents() {
        // Decrease quantity
        document.querySelectorAll('.decrease-qty').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemId = e.target.closest('button').dataset.itemId;
                const currentItem = this.cartService.getItem(itemId);
                if (currentItem) {
                    this.updateQuantity(itemId, currentItem.quantity - 1);
                }
            });
        });

        // Increase quantity
        document.querySelectorAll('.increase-qty').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemId = e.target.closest('button').dataset.itemId;
                const currentItem = this.cartService.getItem(itemId);
                if (currentItem) {
                    this.updateQuantity(itemId, currentItem.quantity + 1);
                }
            });
        });

        // Remove item
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemId = e.target.closest('button').dataset.itemId;
                this.removeFromCart(itemId);
            });
        });
    }

    // Update cart totals
    updateCartTotals() {
        const subtotal = this.cartService.getSubtotal();
        const delivery = this.cartService.getDeliveryCharge();
        const tax = this.cartService.getTax();
        const total = this.cartService.getTotal();

        document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;
        document.getElementById('delivery').textContent = `₹${delivery.toFixed(2)}`;
        document.getElementById('tax').textContent = `₹${tax.toFixed(2)}`;
        document.getElementById('total').textContent = `₹${total.toFixed(2)}`;
    }

    // Update checkout button state
    updateCheckoutButton() {
        const checkoutBtn = document.getElementById('checkoutBtn');
        const hasItems = this.cartService.getTotalItems() > 0;
        
        checkoutBtn.disabled = !hasItems;
        checkoutBtn.innerHTML = hasItems 
            ? '<i class="fas fa-credit-card me-2"></i>Proceed to Checkout'
            : '<i class="fas fa-credit-card me-2"></i>Add items to checkout';
    }

    // Proceed to checkout
    proceedToCheckout() {
        const items = this.cartService.getItems();
        const total = this.cartService.getTotal();
        
        if (items.length === 0) {
            this.showErrorMessage('Your cart is empty');
            return;
        }

        // Show loading
        this.uiController.showLoading();
        
        // Simulate checkout process
        setTimeout(() => {
            this.uiController.hideLoading();
            
            // Trigger payment process
            this.initiatePayment(total);
        }, 1000);
    }

    // Initiate payment
    initiatePayment(amount) {
        // Import payment service and process payment
        import('../services/payment.js').then(module => {
            const paymentService = module.default;
            const cartSummary = this.cartService.getCartSummary();
            
            if (paymentService.isPaymentSupported()) {
                paymentService.processPayment(cartSummary);
            } else {
                this.showErrorMessage('Payment system not available');
            }
        });
    }

    // Handle successful payment (called by payment service)
    handlePaymentSuccess(response) {
        this.showSuccessMessage('Payment successful! Your order is being processed.');
        
        // Clear cart after successful payment
        this.cartService.clearCart();
        this.updateCartUI();
        this.saveCartToStorage();
        
        // Close cart
        this.closeCart();
        
        // Show order tracking
        setTimeout(() => {
            this.uiController.showOrderTracking();
        }, 1500);
    }

    // Animate cart badge
    animateCartBadge() {
        const cartCount = document.getElementById('cartCount');
        cartCount.classList.add('cart-badge-animate');
        
        setTimeout(() => {
            cartCount.classList.remove('cart-badge-animate');
        }, 300);
    }

    // Show success message
    showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            ${message}
        `;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(successDiv);
            }, 300);
        }, 3000);
    }

    // Show error message
    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'success-message';
        errorDiv.style.backgroundColor = 'var(--danger-color)';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle me-2"></i>
            ${message}
        `;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(errorDiv);
            }, 300);
        }, 3000);
    }

    // Save cart to localStorage
    saveCartToStorage() {
        try {
            const cartData = {
                items: this.cartService.getItems(),
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('pizzaCart', JSON.stringify(cartData));
        } catch (error) {
            console.error('Error saving cart to storage:', error);
        }
    }

    // Load cart from localStorage
    loadCartFromStorage() {
        try {
            const cartData = localStorage.getItem('pizzaCart');
            if (cartData) {
                const parsed = JSON.parse(cartData);
                
                // Check if cart data is not too old (e.g., 24 hours)
                const timestamp = new Date(parsed.timestamp);
                const now = new Date();
                const hoursDiff = (now - timestamp) / (1000 * 60 * 60);
                
                if (hoursDiff < 24) {
                    this.cartService.loadItems(parsed.items);
                } else {
                    // Clear old cart data
                    localStorage.removeItem('pizzaCart');
                }
            }
        } catch (error) {
            console.error('Error loading cart from storage:', error);
            localStorage.removeItem('pizzaCart');
        }
    }

    // Get cart service for external access
    getCartService() {
        return this.cartService;
    }
}

// Export singleton instance
const cartController = new CartController();
export default cartController;