// product CRUD operation
// c -> create , R -> Read, U -> update, D - delete
import product from "../models/product.js";
import doNetworkcall from "./api-client.js";

const productOperations = {
    products:[],
    search(pizzaID){
        const product = this.products.find(currentproduct =>currentproduct.id== pizzaID);
        console.log('product Found ', product);
        if (product) {
            product.isAddedInCart = true;
            console.log('Array', this.products);
        } else {
            console.error('Product not found with ID:', pizzaID);
        }
    },
    getProductsInCart(){
        const productInBasket = this.products.filter(product=>product.isAddedInCart);
        return productInBasket;
    },

    async loadProduct(){
        const pizzas =await doNetworkcall();
        const pizzaArray = pizzas['Vegetarian'];
        const productsArray = pizzaArray.map(pizza =>{
            const currentpizza = new product(pizza.id, pizza.name, pizza.menu_description , pizza.price, pizza.assets.product_details_page[0].url);
            return currentpizza;
        })
        console.log('Product Array', productsArray);
        this.products = productsArray;
        return pizzaArray;
    },
    sortProduct(){

    },
    searchProduct(){

    }
}
export default productOperations;