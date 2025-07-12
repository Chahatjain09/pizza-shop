// Main initialization script for Pizza Palace
class PizzaPalaceApp {
    constructor() {
        this.controllers = {};
        this.init();
    }

    async init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeApp();
            });
        } else {
            this.initializeApp();
        }
    }

    async initializeApp() {
        try {
            console.log('🍕 Initializing Pizza Palace...');

            // Initialize all controllers
            await this.initializeControllers();

            // Set up global event listeners
            this.setupGlobalEvents();

            // Initialize UI components
            this.initializeUI();

            console.log('✅ Pizza Palace initialized successfully!');
        } catch (error) {
            console.error('❌ Failed to initialize Pizza Palace:', error);
            this.showErrorMessage('Failed to initialize application. Please refresh the page.');
        }
    }

    async initializeControllers() {
        // Wait for all controllers to be available
        return new Promise((resolve) => {
            let controllersLoaded = 0;
            const totalControllers = 3;

            const checkControllers = () => {
                if (window.productController && window.cartController && window.uiController) {
                    this.controllers = {
                        product: window.productController,
                        cart: window.cartController,
                        ui: window.uiController
                    };
                    resolve();
                } else {
                    controllersLoaded++;
                    if (controllersLoaded < 50) { // Wait max 5 seconds
                        setTimeout(checkControllers, 100);
                    } else {
                        resolve(); // Continue even if some controllers aren't ready
                    }
                }
            };

            checkControllers();
        });
    }

    setupGlobalEvents() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Press 'c' to toggle cart
            if (e.key === 'c' && !e.ctrlKey && !e.altKey && !e.metaKey) {
                const activeElement = document.activeElement;
                if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    if (this.controllers.cart) {
                        this.controllers.cart.toggleCart();
                    }
                }
            }

            // Press 'Escape' to close modals/cart
            if (e.key === 'Escape') {
                if (this.controllers.cart) {
                    this.controllers.cart.closeCart();
                }
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Handle online/offline status
        window.addEventListener('online', () => {
            this.showSuccessMessage('Connection restored!');
        });

        window.addEventListener('offline', () => {
            this.showErrorMessage('You are offline. Some features may not work.');
        });
    }

    initializeUI() {
        // Initialize tooltips if Bootstrap is available
        if (typeof bootstrap !== 'undefined') {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });
        }

        // Add loading states to buttons
        this.enhanceButtons();

        // Initialize animations
        this.initializeAnimations();
    }

    enhanceButtons() {
        // Add loading states to important buttons
        document.querySelectorAll('.btn').forEach(button => {
            if (button.classList.contains('btn-primary') || button.classList.contains('btn-warning')) {
                button.addEventListener('click', function() {
                    if (!this.disabled) {
                        const originalText = this.innerHTML;
                        this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
                        this.disabled = true;

                        // Re-enable button after a short delay
                        setTimeout(() => {
                            this.innerHTML = originalText;
                            this.disabled = false;
                        }, 1000);
                    }
                });
            }
        });
    }

    initializeAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all product cards
        document.querySelectorAll('.product-card').forEach(card => {
            observer.observe(card);
        });

        // Observe other elements that should fade in
        document.querySelectorAll('.hero-section, .special-offers').forEach(element => {
            observer.observe(element);
        });
    }

    handleResize() {
        // Handle responsive changes
        const isMobile = window.innerWidth < 768;
        
        if (isMobile) {
            document.body.classList.add('mobile-view');
        } else {
            document.body.classList.remove('mobile-view');
        }
    }

    showSuccessMessage(message) {
        this.showNotification(message, 'success');
    }

    showErrorMessage(message) {
        this.showNotification(message, 'error');
    }

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

    // Public API for external access
    getController(name) {
        return this.controllers[name];
    }

    // Utility methods
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    }

    getRandomPromo() {
        const promos = [
            'Get 20% off on orders above ₹500!',
            'Free delivery on your next order!',
            'Buy 2 pizzas and get 1 side free!',
            'Student discount available with ID!',
            'Family combo deals starting at ₹800!'
        ];
        return promos[Math.floor(Math.random() * promos.length)];
    }
}

// Initialize the application
const app = new PizzaPalaceApp();

// Make app globally available
window.PizzaPalaceApp = app;

// Export for module usage
export default app;