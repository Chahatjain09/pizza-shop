// UI Controller - Handles UI interactions and animations
class UIController {
    constructor() {
        this.currentProduct = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeModals();
    }

    bindEvents() {
        // Category filter events
        this.bindCategoryFilters();
        
        // Order tracking button
        document.getElementById('trackOrder').addEventListener('click', () => {
            this.showOrderTracking();
        });

        // Modal events
        this.bindModalEvents();
        
        // Smooth scrolling for navigation
        this.bindSmoothScrolling();
    }

    // Bind category filter events
    bindCategoryFilters() {
        const categoryButtons = document.querySelectorAll('input[name="category"]');
        categoryButtons.forEach(button => {
            button.addEventListener('change', (e) => {
                const category = e.target.id;
                this.filterProductsByCategory(category);
                this.updateActiveNavLink(category);
            });
        });

        // Nav link category filters
        document.querySelectorAll('.nav-link[data-category]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = e.target.dataset.category;
                this.filterProductsByCategory(category);
                this.updateActiveNavLink(category);
                
                // Update radio buttons
                const radioButton = document.getElementById(category);
                if (radioButton) {
                    radioButton.checked = true;
                }
            });
        });
    }

    // Filter products by category
    filterProductsByCategory(category) {
        const allProducts = document.querySelectorAll('.product-card');
        
        allProducts.forEach(product => {
            const productCategory = product.dataset.category || 'pizzas';
            
            if (category === 'all' || productCategory === category) {
                product.style.display = 'block';
                product.classList.add('fade-in');
            } else {
                product.style.display = 'none';
                product.classList.remove('fade-in');
            }
        });

        // Scroll to menu section
        document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
    }

    // Update active navigation link
    updateActiveNavLink(category) {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to current category
        const activeLink = document.querySelector(`.nav-link[data-category="${category}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    // Bind modal events
    bindModalEvents() {
        this.bindCustomizationModal();
        this.bindTrackingModal();
    }

    // Bind customization modal events
    bindCustomizationModal() {
        // Quantity controls
        document.getElementById('decreaseQty').addEventListener('click', () => {
            const quantityInput = document.getElementById('quantity');
            const currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
                this.updateModalTotal();
            }
        });

        document.getElementById('increaseQty').addEventListener('click', () => {
            const quantityInput = document.getElementById('quantity');
            const currentValue = parseInt(quantityInput.value);
            if (currentValue < 10) {
                quantityInput.value = currentValue + 1;
                this.updateModalTotal();
            }
        });

        // Size, crust, and toppings change events
        document.querySelectorAll('input[name="size"], input[name="crust"], input[name="toppings"]').forEach(input => {
            input.addEventListener('change', () => {
                this.updateModalTotal();
            });
        });

        // Quantity input change
        document.getElementById('quantity').addEventListener('change', () => {
            this.updateModalTotal();
        });

        // Add to cart button
        document.getElementById('addToCartBtn').addEventListener('click', () => {
            this.addCustomizedItemToCart();
        });

        // Reset modal when closed
        document.getElementById('customizationModal').addEventListener('hidden.bs.modal', () => {
            this.resetCustomizationModal();
        });
    }

    // Bind tracking modal events
    bindTrackingModal() {
        document.getElementById('trackingModal').addEventListener('shown.bs.modal', () => {
            this.animateTrackingSteps();
        });
    }

    // Show customization modal
    showCustomizationModal(product) {
        this.currentProduct = product;
        
        // Update modal title
        document.querySelector('#customizationModal .modal-title').textContent = `Customize Your ${product.name}`;
        
        // Reset form
        this.resetCustomizationModal();
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('customizationModal'));
        modal.show();
        
        // Update total
        this.updateModalTotal();
    }

    // Reset customization modal
    resetCustomizationModal() {
        // Reset size to medium
        document.getElementById('medium').checked = true;
        
        // Reset crust to thin
        document.getElementById('thin').checked = true;
        
        // Uncheck all toppings
        document.querySelectorAll('input[name="toppings"]').forEach(input => {
            input.checked = false;
        });
        
        // Reset quantity
        document.getElementById('quantity').value = 1;
        
        // Update total
        this.updateModalTotal();
    }

    // Update modal total price
    updateModalTotal() {
        if (!this.currentProduct) return;
        
        let total = this.currentProduct.basePrice;
        
        // Add size price
        const selectedSize = document.querySelector('input[name="size"]:checked');
        if (selectedSize) {
            total += parseInt(selectedSize.dataset.price);
        }
        
        // Add crust price
        const selectedCrust = document.querySelector('input[name="crust"]:checked');
        if (selectedCrust) {
            total += parseInt(selectedCrust.dataset.price);
        }
        
        // Add toppings price
        const selectedToppings = document.querySelectorAll('input[name="toppings"]:checked');
        selectedToppings.forEach(topping => {
            total += parseInt(topping.dataset.price);
        });
        
        // Multiply by quantity
        const quantity = parseInt(document.getElementById('quantity').value);
        total *= quantity;
        
        // Update display
        document.getElementById('modalTotal').textContent = total;
    }

    // Add customized item to cart
    addCustomizedItemToCart() {
        if (!this.currentProduct) return;
        
        const customizations = this.getCustomizations();
        const quantity = parseInt(document.getElementById('quantity').value);
        
        const cartItem = {
            productId: this.currentProduct.id,
            name: this.currentProduct.name,
            image: this.currentProduct.image,
            basePrice: this.currentProduct.basePrice,
            quantity: quantity,
            customizations: customizations
        };
        
        // Import cart controller and add item
        import('./cart-controller.js').then(module => {
            module.default.addToCart(cartItem);
        });
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('customizationModal'));
        modal.hide();
    }

    // Get customizations from modal
    getCustomizations() {
        const customizations = {};
        
        // Get size
        const selectedSize = document.querySelector('input[name="size"]:checked');
        if (selectedSize) {
            customizations.size = selectedSize.value;
        }
        
        // Get crust
        const selectedCrust = document.querySelector('input[name="crust"]:checked');
        if (selectedCrust) {
            customizations.crust = selectedCrust.value;
        }
        
        // Get toppings
        const selectedToppings = document.querySelectorAll('input[name="toppings"]:checked');
        if (selectedToppings.length > 0) {
            customizations.toppings = Array.from(selectedToppings).map(t => t.value);
        }
        
        return customizations;
    }

    // Show order tracking modal
    showOrderTracking() {
        const modal = new bootstrap.Modal(document.getElementById('trackingModal'));
        modal.show();
    }

    // Animate tracking steps
    animateTrackingSteps() {
        const steps = document.querySelectorAll('.step');
        steps.forEach((step, index) => {
            if (step.classList.contains('completed') || step.classList.contains('active')) {
                setTimeout(() => {
                    step.style.opacity = '0';
                    step.style.transform = 'translateX(-20px)';
                    setTimeout(() => {
                        step.style.opacity = '1';
                        step.style.transform = 'translateX(0)';
                        step.style.transition = 'all 0.3s ease';
                    }, 100);
                }, index * 200);
            }
        });
    }

    // Show loading overlay
    showLoading() {
        const overlay = document.getElementById('loadingOverlay');
        overlay.classList.add('active');
    }

    // Hide loading overlay
    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        overlay.classList.remove('active');
    }

    // Initialize modals
    initializeModals() {
        // Initialize Bootstrap modals
        const modalElements = document.querySelectorAll('.modal');
        modalElements.forEach(modalElement => {
            new bootstrap.Modal(modalElement);
        });
    }

    // Bind smooth scrolling
    bindSmoothScrolling() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
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

    // Show success notification
    showSuccessNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'success-message';
        notification.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
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

    // Show error notification
    showErrorNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'success-message';
        notification.style.backgroundColor = 'var(--danger-color)';
        notification.innerHTML = `
            <i class="fas fa-exclamation-circle me-2"></i>
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

    // Update page title with cart count
    updatePageTitle(cartCount) {
        const baseTitle = 'Pizza Palace - Order Online';
        document.title = cartCount > 0 ? `(${cartCount}) ${baseTitle}` : baseTitle;
    }

    // Handle responsive navigation
    handleResponsiveNav() {
        const navbar = document.querySelector('.navbar-collapse');
        const navToggler = document.querySelector('.navbar-toggler');
        
        // Close mobile menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (navbar.classList.contains('show')) {
                    navToggler.click();
                }
            });
        });
    }

    // Initialize all UI features
    initializeUI() {
        this.animateProductCards();
        this.handleResponsiveNav();
    }
}

// Export singleton instance
const uiController = new UIController();
export default uiController;