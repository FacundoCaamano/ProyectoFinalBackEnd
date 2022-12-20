import fs from 'fs';

class CartManager{
    constructor(path){
        this.carts=new Array();
        this.path=path;
        this.format = 'utf-8';
    }

    get = async () => {
        try{
            let contenido = await fs.promises.readFile(this.path,this.format)
            this.carts = JSON.parse(contenido)
            return this.carts
        }
        catch(err){
            return "No se pudo obtener los carros"
        }
        
    }

    getNextId(){
        let size = this.carts.length
        return size > 0 ? this.carts[size-1].id + 1 : 1 
    }   

    async add(){
        await this.get()
        const newCart={
            id: this.getNextId(),
            products: new Array()
        }
        return 
            (this.carts.push(newCart), await fs.promises.writeFile(this.path, JSON.stringify(this.carts)), newCart)
    }


    getById = async (id) => {
        await this.get()
        return this.carts.find(c => c.id == id) || "No se encontro el id del carro";
        
    }
    
    addById = async (cartID,productID,quantity) => {
        const cart = await this.getCartById(cartID) 
        const product = cart.products?.find(product => product.product == productID)

        if 
            (!product) cart.products?.push({product: productID, quantity: quantity})
        else 
            product.quantity += quantity

        return (await fs.promises.writeFile(this.path, JSON.stringify(this.carts)),cart)
        
    }

}


export default CartManager;