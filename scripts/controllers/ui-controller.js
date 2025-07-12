// UI Controller - Handles UI interactions and animations
class UIController {
    constructor() {
        this.currentProduct = null;
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.bindEvents();
                this.initializeModals();
            });
        } else {
            this.bindEvents();
            this.initializeModals();
        }
    }

    bindEvents() {
        // Category filter events
        this.bindCategoryFilters();
        
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
        const menuSection = document.getElementById('menu');
        if (menuSection) {
            menuSection.scrollIntoView({ behavior: 'smooth' });
        }
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
        const decreaseQty = document.getElementById('decreaseQty');
        if (decreaseQty) {
            decreaseQty.addEventListener('click', () => {
                const quantityInput = document.getElementById('quantity');
                if (quantityInput) {
                    const currentValue = parseInt(quantityInput.value);
                    if (currentValue > 1) {
                        quantityInput.value = currentValue - 1;
                        this.updateModalTotal();
                    }
                }
            });
        }

        const increaseQty = document.getElementById('increaseQty');
        if (increaseQty) {
            increaseQty.addEventListener('click', () => {
                const quantityInput = document.getElementById('quantity');
                if (quantityInput) {
                    const currentValue = parseInt(quantityInput.value);
                    if (currentValue < 10) {
                        quantityInput.value = currentValue + 1;
                        this.updateModalTotal();
                    }
                }
            });
        }

        // Size, crust, and toppings change events
        document.querySelectorAll('input[name="size"], input[name="crust"], input[name="toppings"]').forEach(input => {
            input.addEventListener('change', () => {
                this.updateModalTotal();
            });
        });

        // Quantity input change
        const quantityInput = document.getElementById('quantity');
        if (quantityInput) {
            quantityInput.addEventListener('change', () => {
                this.updateModalTotal();
            });
        }

        // Add to cart button
        const addToCartBtn = document.getElementById('addToCartBtn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                this.addCustomizedItemToCart();
            });
        }

        // Reset modal when closed
        const customizationModal = document.getElementById('customizationModal');
        if (customizationModal) {
            customizationModal.addEventListener('hidden.bs.modal', () => {
                this.resetCustomizationModal();
            });
        }
    }

    // Bind tracking modal events
    bindTrackingModal() {
        const trackingModal = document.getElementById('trackingModal');
        if (trackingModal) {
            trackingModal.addEventListener('shown.bs.modal', () => {
                this.animateTrackingSteps();
            });
        }
    }

    // Reset customization modal
    resetCustomizationModal() {
        // Reset size to medium
        const mediumSize = document.getElementById('medium');
        if (mediumSize) mediumSize.checked = true;
        
        // Reset crust to thin
        const thinCrust = document.getElementById('thin');
        if (thinCrust) thinCrust.checked = true;
        
        // Uncheck all toppings
        document.querySelectorAll('input[name="toppings"]').forEach(input => {
            input.checked = false;
        });
        
        // Reset quantity
        const quantityInput = document.getElementById('quantity');
        if (quantityInput) quantityInput.value = 1;
        
        // Update total
        this.updateModalTotal();
    }

    // Update modal total price
    updateModalTotal() {
        const currentProduct = window.currentProduct;
        if (!currentProduct) return;
        
        let total = currentProduct.basePrice;
        
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
        const quantityInput = document.getElementById('quantity');
        const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
        total *= quantity;
        
        // Update display
        const modalTotal = document.getElementById('modalTotal');
        if (modalTotal) {
            modalTotal.textContent = total;
        }
    }

    // Add customized item to cart
    addCustomizedItemToCart() {
        const currentProduct = window.currentProduct;
        if (!currentProduct) return;
        
        const customizations = this.getCustomizations();
        const quantityInput = document.getElementById('quantity');
        const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
        
        const cartItem = {
            productId: currentProduct.id,
            name: currentProduct.name,
            image: currentProduct.image,
            basePrice: currentProduct.basePrice,
            quantity: quantity,
            customizations: customizations
        };
        
        // Trigger add to cart event
        const event = new CustomEvent('addToCart', {
            detail: cartItem
        });
        window.dispatchEvent(event);
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('customizationModal'));
        if (modal) {
            modal.hide();
        }
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

    // Initialize modals
    initializeModals() {
        // Initialize Bootstrap modals if available
        if (typeof bootstrap !== 'undefined') {
            const modalElements = document.querySelectorAll('.modal');
            modalElements.forEach(modalElement => {
                new bootstrap.Modal(modalElement);
            });
        }
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

    // Handle responsive navigation
    handleResponsiveNav() {
        const navbar = document.querySelector('.navbar-collapse');
        const navToggler = document.querySelector('.navbar-toggler');
        
        // Close mobile menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (navbar && navbar.classList.contains('show') && navToggler) {
                    navToggler.click();
                }
            });
        });
    }

    // Initialize all UI features
    initializeUI() {
        this.handleResponsiveNav();
    }
}

// Initialize UI controller when DOM is ready
let uiController;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        uiController = new UIController();
        window.uiController = uiController;
    });
} else {
    uiController = new UIController();
    window.uiController = uiController;
}

export default uiController;