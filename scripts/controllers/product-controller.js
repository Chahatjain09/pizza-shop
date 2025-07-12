// glue b/w view and model
// controller UI i/o
import productOperations from "../services/product-operations.js";

let allProducts = [];
let filteredProducts = [];

// Make productOperations available globally for payment service
window.productOperations = productOperations;

async function loadpizzas() {
    try {
        showLoading(true);
        const pizzas = await productOperations.loadProduct();
        console.log('Pizzas are ', pizzas);
        allProducts = pizzas;
        filteredProducts = pizzas;
        displayProducts(pizzas);
        showLoading(false);
        updateProductCount(pizzas.length);
    } catch (error) {
        console.error('Error loading pizzas:', error);
        showError('Failed to load pizzas. Please try again.');
        showLoading(false);
    }
}

function showLoading(show) {
    const loadingSpinner = document.querySelector('#loadingSpinner');
    const output = document.querySelector('#output');
    const errorMessage = document.querySelector('#errorMessage');
    
    if (show) {
        loadingSpinner.style.display = 'flex';
        output.style.display = 'none';
        errorMessage.style.display = 'none';
    } else {
        loadingSpinner.style.display = 'none';
        output.style.display = 'block';
    }
}

function showError(message) {
    const errorMessage = document.querySelector('#errorMessage');
    const loadingSpinner = document.querySelector('#loadingSpinner');
    const output = document.querySelector('#output');
    
    loadingSpinner.style.display = 'none';
    output.style.display = 'none';
    errorMessage.style.display = 'block';
}

function updateProductCount(count) {
    const productCount = document.querySelector('#productCount');
    productCount.textContent = `${count} items`;
}

function displayProducts(products) {
    const outputDiv = document.querySelector('#output');
    outputDiv.innerHTML = '';
    
    if (products.length === 0) {
        outputDiv.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-search display-1 text-muted"></i>
                <h3 class="mt-3">No pizzas found</h3>
                <p class="text-muted">Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }
    
    for(let pizza of products){
        preparePizzaCard(pizza);
    }
}

function addToCart(){
    console.log('Add to cart called...', this);
    const currentButton = this;
    const pizzaID = currentButton.getAttribute('product-id');
    console.log('pizza ID is', pizzaID);
    productOperations.addToCart(pizzaID);
    printBasket();
    showSuccessMessage('Item added to cart!');
}

function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success alert-dismissible fade show position-fixed';
    successDiv.style.cssText = 'top: 20px; right: 20px; z-index: 1000;';
    successDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(successDiv);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 3000);
}

function removeFromCart(){
    const currentButton = this;
    const pizzaID = currentButton.getAttribute('product-id');
    productOperations.removeFromCart(pizzaID);
    printBasket();
    showSuccessMessage('Item removed from cart!');
}

function updateQuantity(){
    const currentInput = this;
    const pizzaID = currentInput.getAttribute('product-id');
    const quantity = parseInt(currentInput.value);
    if (quantity > 0) {
        productOperations.updateQuantity(pizzaID, quantity);
        printBasket();
    }
}

function printBasket(){
    const cartproducts = productOperations.getProductsInCart();
    const basket = document.querySelector('#basket');
    basket.innerHTML = '';
    
    if (cartproducts.length === 0) {
        basket.innerHTML = `
            <div class="text-center py-4">
                <i class="bi bi-cart-x display-4 text-muted"></i>
                <h5 class="mt-3">Your cart is empty</h5>
                <p class="text-muted">Add some delicious pizzas to get started!</p>
            </div>
        `;
        return;
    }
    
    const basketTitle = document.createElement('h4');
    basketTitle.className = 'mb-3 d-flex align-items-center';
    basketTitle.innerHTML = `
        <i class="bi bi-cart3 me-2"></i>
        Your Cart (${cartproducts.length})
    `;
    basket.appendChild(basketTitle);
    
    let total = 0;
    
    for(let product of cartproducts){
        const card = document.createElement('div');
        card.className = 'card mb-2';
        card.innerHTML = `
            <div class="card-body p-3">
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <h6 class="card-title mb-1">${product.name}</h6>
                        <p class="card-text text-muted mb-2">₹${product.price}</p>
                        <div class="d-flex align-items-center gap-2">
                            <div class="input-group input-group-sm" style="width: 120px;">
                                <button class="btn btn-outline-secondary btn-sm" type="button" onclick="decrementQuantity('${product.id}')">-</button>
                                <input type="number" class="form-control text-center" value="${product.quantity || 1}" min="1" max="10" product-id="${product.id}" onchange="updateQuantity.call(this)">
                                <button class="btn btn-outline-secondary btn-sm" type="button" onclick="incrementQuantity('${product.id}')">+</button>
                            </div>
                            <span class="text-muted small">₹${product.price * (product.quantity || 1)}</span>
                        </div>
                    </div>
                    <button class="btn btn-outline-danger btn-sm ms-2" product-id="${product.id}" onclick="removeFromCart.call(this)" title="Remove item">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;
        basket.appendChild(card);
        total += product.price * (product.quantity || 1);
    }
    
    const totalDiv = document.createElement('div');
    totalDiv.className = 'card mt-3 border-success';
    totalDiv.innerHTML = `
        <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="card-title mb-0">Total:</h5>
                <h5 class="card-title mb-0 text-success">₹${total}</h5>
            </div>
            <button id="rzp-button1" class="btn btn-success w-100" onclick="initializePayment(${total})" ${total === 0 ? 'disabled' : ''}>
                <i class="bi bi-credit-card me-2"></i>
                Pay ₹${total}
            </button>
        </div>
    `;
    basket.appendChild(totalDiv);
    
    // Update payment amount
    window.updatePaymentAmount(total);
}

// Make printBasket available globally for payment service
window.printBasket = printBasket;

// Global functions for quantity buttons
window.decrementQuantity = function(productId) {
    const input = document.querySelector(`input[product-id="${productId}"]`);
    if (input && parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
        updateQuantity.call(input);
    }
};

window.incrementQuantity = function(productId) {
    const input = document.querySelector(`input[product-id="${productId}"]`);
    if (input && parseInt(input.value) < 10) {
        input.value = parseInt(input.value) + 1;
        updateQuantity.call(input);
    }
};

window.updateQuantity = updateQuantity;

function preparePizzaCard(pizza){
    const outputDiv = document.querySelector('#output');
    const colDiv = document.createElement('div');
    colDiv.className = 'col-lg-4 col-md-6 col-sm-12 mb-4';
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card h-100 shadow-sm';
    colDiv.appendChild(cardDiv);
    
    const img = document.createElement('img');
    img.src = pizza.assets.product_details_page[0].url;
    img.className = 'card-img-top';
    img.style.height = '200px';
    img.style.objectFit = 'cover';
    img.alt = pizza.name;
    cardDiv.appendChild(img);
    
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body d-flex flex-column';
    cardDiv.appendChild(cardBody);
    
    const h5 = document.createElement('h5');
    h5.className = 'card-title';
    h5.innerText = pizza.name;
    
    const pTag = document.createElement('p');
    pTag.className = 'card-text flex-grow-1';
    pTag.innerText = pizza.menu_description;
    
    const priceDiv = document.createElement('div');
    priceDiv.className = 'd-flex justify-content-between align-items-center mb-3';
    priceDiv.innerHTML = `
        <span class="h5 text-primary mb-0">₹${pizza.price}</span>
        <span class="badge bg-success">${pizza.rating || '4.5'} ⭐</span>
    `;
    
    const button = document.createElement('button');
    button.innerText = 'Add to Cart';
    button.className = 'btn btn-primary w-100';
    button.setAttribute('product-id', pizza.id);
    button.addEventListener('click', addToCart);
    
    cardBody.appendChild(h5);
    cardBody.appendChild(pTag);
    cardBody.appendChild(priceDiv);
    cardBody.appendChild(button);
    outputDiv.appendChild(colDiv);
}

// Search and Filter Functions
function handleSearch() {
    const searchQuery = document.querySelector('#searchInput').value.toLowerCase();
    const sortBy = document.querySelector('#sortSelect').value;
    
    let filtered = allProducts.filter(pizza => 
        pizza.name.toLowerCase().includes(searchQuery) ||
        pizza.menu_description.toLowerCase().includes(searchQuery)
    );
    
    if (sortBy) {
        filtered = productOperations.sortProduct(sortBy);
        // Re-apply search filter after sorting
        filtered = filtered.filter(pizza => 
            pizza.name.toLowerCase().includes(searchQuery) ||
            pizza.menu_description.toLowerCase().includes(searchQuery)
        );
    }
    
    filteredProducts = filtered;
    displayProducts(filtered);
    updateProductCount(filtered.length);
}

function handleSort() {
    const sortBy = document.querySelector('#sortSelect').value;
    const searchQuery = document.querySelector('#searchInput').value.toLowerCase();
    
    let filtered = allProducts;
    
    if (searchQuery) {
        filtered = allProducts.filter(pizza => 
            pizza.name.toLowerCase().includes(searchQuery) ||
            pizza.menu_description.toLowerCase().includes(searchQuery)
        );
    }
    
    if (sortBy) {
        filtered = productOperations.sortProduct(sortBy);
        // Re-apply search filter after sorting
        if (searchQuery) {
            filtered = filtered.filter(pizza => 
                pizza.name.toLowerCase().includes(searchQuery) ||
                pizza.menu_description.toLowerCase().includes(searchQuery)
            );
        }
    }
    
    filteredProducts = filtered;
    displayProducts(filtered);
    updateProductCount(filtered.length);
}

function clearFilters() {
    document.querySelector('#searchInput').value = '';
    document.querySelector('#sortSelect').value = '';
    filteredProducts = allProducts;
    displayProducts(allProducts);
    updateProductCount(allProducts.length);
}

// Initialize event listeners
function initializeEventListeners() {
    const searchInput = document.querySelector('#searchInput');
    const sortSelect = document.querySelector('#sortSelect');
    const clearFiltersBtn = document.querySelector('#clearFilters');
    
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSort);
    }
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadpizzas();
});