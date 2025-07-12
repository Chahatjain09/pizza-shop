// Enhanced Payment Service for Pizza Palace
class PaymentService {
    constructor() {
        this.initializeRazorpay();
    }

    initializeRazorpay() {
        // Default payment options
        this.defaultOptions = {
            "key": "rzp_test_M7ec5ZnuHkoyje", // Enter the Key ID generated from the Dashboard
            "currency": "INR",
            "name": "Pizza Palace", // Business name
            "description": "Fresh Pizza Delivered Hot & Fast",
            "image": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop",
            "prefill": {
                "name": "Customer", // Default customer name
                "email": "customer@example.com",
                "contact": "9999999999" // Default contact
            },
            "notes": {
                "address": "Pizza Palace - Online Order"
            },
            "theme": {
                "color": "#0066cc"
            },
            "modal": {
                "ondismiss": function() {
                    console.log('Payment cancelled by user');
                }
            }
        };

        // Create Razorpay instance
        this.createRazorpayInstance(this.defaultOptions);
    }

    createRazorpayInstance(options) {
        if (typeof Razorpay === 'undefined') {
            console.error('Razorpay SDK not loaded');
            return;
        }

        window.rzp1 = new Razorpay(options);
        
        // Handle payment failures
        window.rzp1.on('payment.failed', (response) => {
            this.handlePaymentFailure(response);
        });
    }

    // Process payment with cart details
    processPayment(cartSummary, customerDetails = {}) {
        const amount = Math.round(cartSummary.total * 100); // Convert to paise
        
        const paymentOptions = {
            ...this.defaultOptions,
            "amount": amount.toString(),
            "handler": (response) => {
                this.handlePaymentSuccess(response, cartSummary);
            },
            "prefill": {
                "name": customerDetails.name || this.defaultOptions.prefill.name,
                "email": customerDetails.email || this.defaultOptions.prefill.email,
                "contact": customerDetails.contact || this.defaultOptions.prefill.contact
            },
            "notes": {
                "address": customerDetails.address || this.defaultOptions.notes.address,
                "order_items": cartSummary.items.length,
                "order_value": cartSummary.total
            }
        };

        // Create new instance with updated options
        this.createRazorpayInstance(paymentOptions);
        
        // Open payment modal
        window.rzp1.open();
    }

    // Handle successful payment
    handlePaymentSuccess(response, cartSummary) {
        console.log('Payment successful:', response);
        
        // Create order record
        const orderDetails = {
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id || this.generateOrderId(),
            signature: response.razorpay_signature,
            amount: cartSummary.total,
            items: cartSummary.items,
            timestamp: new Date().toISOString(),
            status: 'paid'
        };

        // Save order to localStorage
        this.saveOrder(orderDetails);

        // Show success message
        this.showSuccessMessage('Payment successful! Your order is being processed.');

        // Trigger order confirmation
        this.triggerOrderConfirmation(orderDetails);
    }

    // Handle payment failure
    handlePaymentFailure(response) {
        console.error('Payment failed:', response);
        
        let errorMessage = 'Payment failed. Please try again.';
        
        if (response.error) {
            switch (response.error.code) {
                case 'BAD_REQUEST_ERROR':
                    errorMessage = 'Invalid payment request. Please check your details.';
                    break;
                case 'GATEWAY_ERROR':
                    errorMessage = 'Payment gateway error. Please try again.';
                    break;
                case 'NETWORK_ERROR':
                    errorMessage = 'Network error. Please check your connection.';
                    break;
                case 'SERVER_ERROR':
                    errorMessage = 'Server error. Please try again later.';
                    break;
                default:
                    errorMessage = response.error.description || errorMessage;
            }
        }

        this.showErrorMessage(errorMessage);
    }

    // Generate order ID
    generateOrderId() {
        return 'PP_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Save order to localStorage
    saveOrder(orderDetails) {
        try {
            const orders = JSON.parse(localStorage.getItem('pizzaOrders') || '[]');
            orders.push(orderDetails);
            localStorage.setItem('pizzaOrders', JSON.stringify(orders));
        } catch (error) {
            console.error('Error saving order:', error);
        }
    }

    // Get all orders
    getOrders() {
        try {
            return JSON.parse(localStorage.getItem('pizzaOrders') || '[]');
        } catch (error) {
            console.error('Error retrieving orders:', error);
            return [];
        }
    }

    // Get order by ID
    getOrderById(orderId) {
        const orders = this.getOrders();
        return orders.find(order => order.orderId === orderId);
    }

    // Trigger order confirmation
    triggerOrderConfirmation(orderDetails) {
        // Dispatch custom event for order confirmation
        const event = new CustomEvent('orderConfirmed', {
            detail: orderDetails
        });
        window.dispatchEvent(event);
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
                if (document.body.contains(successDiv)) {
                    document.body.removeChild(successDiv);
                }
            }, 300);
        }, 4000);
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
                if (document.body.contains(errorDiv)) {
                    document.body.removeChild(errorDiv);
                }
            }, 300);
        }, 5000);
    }

    // Validate payment amount
    validatePaymentAmount(amount) {
        return amount > 0 && amount <= 500000; // Max 5000 INR
    }

    // Get payment methods
    getPaymentMethods() {
        return [
            { id: 'card', name: 'Credit/Debit Card', icon: 'fas fa-credit-card' },
            { id: 'upi', name: 'UPI', icon: 'fas fa-mobile-alt' },
            { id: 'netbanking', name: 'Net Banking', icon: 'fas fa-university' },
            { id: 'wallet', name: 'Wallet', icon: 'fas fa-wallet' }
        ];
    }

    // Check if payment is supported
    isPaymentSupported() {
        return typeof Razorpay !== 'undefined';
    }
}

// Initialize payment service
const paymentService = new PaymentService();

// Listen for order confirmation
window.addEventListener('orderConfirmed', (event) => {
    console.log('Order confirmed:', event.detail);
    
    // Import cart controller to clear cart
    import('../controllers/cart-controller.js').then(module => {
        module.default.getCartService().clearCart();
        module.default.updateCartUI();
        module.default.saveCartToStorage();
    });
    
    // Show order tracking after a delay
    setTimeout(() => {
        import('../controllers/ui-controller.js').then(module => {
            module.default.showOrderTracking();
        });
    }, 2000);
});

export default paymentService;