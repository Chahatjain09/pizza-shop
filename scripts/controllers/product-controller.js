// glue b/w view and model
// controller UI i/o
import productOperations from "../services/product-operations.js";
async function loadpizzas() {
    const pizzas = await productOperations.loadProduct();
    console.log('Pizzas are ', pizzas);
    for(let pizza of pizzas){
        preparePizzaCard(pizza);
    }
    
}
loadpizzas();

function addToCart(){
    console.log('Add to cart called...', this);
    const currentButton = this;
    const pizzaID = currentButton.getAttribute('product-id');
    console.log('pizza ID is', pizzaID);
    productOperations.search(pizzaID);
    printBasket();
}

function printBasket(){
    const cartproducts = productOperations.getProductsInCart();
    const basket = document.querySelector('#basket');
    basket.innerHTML = '';
    for(let product of cartproducts){
       const li = document.createElement('li');
       li.innerText = `${product.name} ${product.price}`;
       basket.appendChild(li);
    }
}

function preparePizzaCard(pizza){
    const outputDiv =document.querySelector('#output');
    const colDiv = document.createElement('div');
    colDiv.className = 'col-4';
    const cardDiv = document.createElement('div');
    cardDiv.className ='card';
    cardDiv.style = "width: 18rem;";
    colDiv.appendChild(cardDiv);
    const img =document.createElement('img');
    img.src = pizza.assets.product_details_page[0].url;
    img.className = 'card-img-top';
    cardDiv.appendChild(img);
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    cardDiv.appendChild(cardBody);
    const h5 = document.createElement('h5');
    h5.className = 'card-title';
    h5.innerText = pizza.name;
    const pTag = document.createElement('p');
    pTag.className = 'card-text';
    pTag.innerText = pizza.menu_description;
    const button = document.createElement('button');
    button.innerText = 'Add to Cart';
    button.className = 'btn btn-primary';
    button.setAttribute('product-id', pizza.id);
    button.addEventListener('click', addToCart);
    cardBody.appendChild(h5);
    cardBody.appendChild(pTag);
    cardBody.appendChild(button);
    outputDiv.appendChild(colDiv);
}