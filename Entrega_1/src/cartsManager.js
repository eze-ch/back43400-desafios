import fs from 'fs';
import { ProductManager } from "./productManager.js";

class CartsManager{

    constructor(pathCarts, pathProducts) {
        this.pathCarts = pathCarts;
        this.pathProducts = pathProducts;
        this.arrayProps = ['id', 'code', 'quantity'];

        this.productManager = new ProductManager(this.pathProducts);
    }

    async getCarts() {
        try {
            if (fs.existsSync(this.pathCarts)) {
                const archiveInfo = await fs.promises.readFile(this.pathCarts, 'utf-8');
                return JSON.parse(archiveInfo);
            } else {
                return [];
            }

        } catch (error) {
            console.log("archivo NO encontrado");
            return error;
        }
    }


    async addCart() {
        try{
            const carts = await this.getCarts();
            const arrayProductEmpty = [];

            //create ID product
            let id;
            if(!carts.length){
                id = 1;
            } else {
                id = carts[carts.length - 1].id + 1;
            }

            const newCart = { id, products: arrayProductEmpty };

            carts.push(newCart);
            await fs.promises.writeFile(this.pathCarts, JSON.stringify(carts));

            return newCart;

        } catch (error) {
            return error;
        }
    }


    async getCartById(id) {
        try {

            const carts = await this.getCarts()
            const cart = carts.find((c) => c.id === id)
            console.log(carts)
            console.log(carts.length)
            console.log(cart)
            if (cart) {
              console.log(`Carrito con ID ${id} encontrado.`);
              return cart;
            } else {
              console.log(`Error. Carrito con ID ${id} no existe.`);
              return null;
            }

        } catch (error) {
            return error;
        }
    }


    async addProductToCart (cid, pid) {
        try{
            
            const carts = await this.getCarts();
            const cart = carts.find(c => c.id === +cid);

            const products = await this.productManager.getProducts();
            const product = products.find(p => p.id === +pid);

            if(!cart){
                return 'Cart no encontrado';
            }
            if(!product){
                return 'Producto no encontrado';
            }
            if(product.stock === 0){
                return 'No hay stock disponible';
            }

            const productOnCart = cart.products.find(p => p.id === +pid);
            const productFiltered = this.cleaningProduct(product);

            if(!productOnCart){
                productFiltered.quantity = 1;
                cart.products.push(productFiltered);
            } else {
                productOnCart.quantity += 1;
            }
            
            fs.promises.writeFile(this.pathCarts, JSON.stringify(carts));

            // Resto el stock del producto
            product.stock -= 1;
            if(product.stock === 0){ 
                product.status = false;
            }

            fs.promises.writeFile(this.pathProducts, JSON.stringify(products));

            return cart;

        } catch (error) {
            return error;
        }
    
    }

        
    cleaningProduct (product) {
        let validProduct = {};

        for (const property in product) {
            if (this.arrayProps.includes(property)) {
                validProduct[property] = product[property];
            }
        }

        return validProduct;
    };

}

export {CartsManager}