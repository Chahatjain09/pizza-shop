// product model (blue print)
// pizza Object -ID, Name, desc,Price,rating,Image
class product {
    constructor(id, name, desc, price, url) {
     // this - keyword (contain current calling object referance) 
        this.id = id;
        this.name =name;
        this.desc = desc;
        this.price = price;
        this.url = url;
        this.isAddedInCart = false;
    }
}
export default product;