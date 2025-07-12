// product CRUD operation
// c -> create , R -> Read, U -> update, D - delete
import product from "../models/product.js";
import doNetworkcall from "./api-client.js";

const productOperations = {
    products: [],
    cart: [],
    
    addToCart(pizzaID) {
        const product = this.products.find(currentproduct => currentproduct.id == pizzaID);
        if (product) {
            const existingCartItem = this.cart.find(item => item.id == pizzaID);
            if (existingCartItem) {
                existingCartItem.quantity = (existingCartItem.quantity || 1) + 1;
            } else {
                const cartItem = {
                    ...product,
                    quantity: 1,
                    isAddedInCart: true
                };
                this.cart.push(cartItem);
            }
            console.log('Product added to cart:', product.name);
        }
    },
    
    removeFromCart(pizzaID) {
        const index = this.cart.findIndex(item => item.id == pizzaID);
        if (index !== -1) {
            this.cart.splice(index, 1);
            console.log('Product removed from cart');
        }
    },
    
    updateQuantity(pizzaID, quantity) {
        const cartItem = this.cart.find(item => item.id == pizzaID);
        if (cartItem) {
            cartItem.quantity = quantity;
            console.log('Quantity updated for:', cartItem.name);
        }
    },
    
    search(pizzaID) {
        const product = this.products.find(currentproduct => currentproduct.id == pizzaID);
        console.log('product Found ', product);
        if (product) {
            product.isAddedInCart = true;
        }
        console.log('Array', this.products);
    },
    
    getProductsInCart() {
        return this.cart;
    },
    
    getCartTotal() {
        return this.cart.reduce((total, item) => {
            return total + (item.price * (item.quantity || 1));
        }, 0);
    },
    
    clearCart() {
        this.cart = [];
        console.log('Cart cleared');
    },

    async loadProduct() {
        try {
            const pizzas = await doNetworkcall();
            const pizzaArray = pizzas['Vegetarian'];
            const productsArray = pizzaArray.map(pizza => {
                const currentpizza = new product(
                    pizza.id, 
                    pizza.name, 
                    pizza.menu_description, 
                    pizza.price, 
                    pizza.assets.product_details_page[0].url
                );
                return currentpizza;
            });
            console.log('Product Array', productsArray);
            this.products = productsArray;
            return pizzaArray;
        } catch (error) {
            console.error('Error loading products:', error);
            throw error;
        }
    },
    
    sortProduct(sortBy = 'name') {
        switch(sortBy) {
            case 'price-low':
                return [...this.products].sort((a, b) => a.price - b.price);
            case 'price-high':
                return [...this.products].sort((a, b) => b.price - a.price);
            case 'name':
                return [...this.products].sort((a, b) => a.name.localeCompare(b.name));
            default:
                return this.products;
        }
    },
    
    searchProduct(query) {
        if (!query) return this.products;
        return this.products.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.desc.toLowerCase().includes(query.toLowerCase())
        );
    }
};

export default productOperations;