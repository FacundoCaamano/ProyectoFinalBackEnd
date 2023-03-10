import productsModel from '../../models/products.model.js'

class ProductManager{


    get = async (limit = '', page = '', sort = '', query = '') => {
        try{
            let querySearch = query ? (query=='disponible' ? {stock:{$gt:0}} : {category:{$regex:query, $options:'i'}}) : {};
            let sortChoosen = sort ? (sort=='asc'?{price:1}:(sort=='desc'?{price:-1}:{})) : {};
            let content=await productsModel.paginate(querySearch,{limit: limit || 10, page: page || 1, sort:sortChoosen, lean : true});
            const prevLink = content.hasPrevPage ? (`products?${'page='+content.prevPage}${limit&&'&limit='+limit}${sort&&'&sort='+sort}${query&&'&query='+query}`) : null;
            const nextLink = content.hasNextPage ? (`products?${'page='+content.nextPage}${limit&&'&limit='+limit}${sort&&'&sort='+sort}${query&&'&query='+query}`) : null;
            return {
                status:'success', 
                payload: content.docs, 
                totalPages:content.totalPages, 
                prevPage: content.prevPage, 
                nextPage: content.nextPage, 
                page: content.page, 
                hasPrevPage: content.hasPrevPage, 
                hasNextPage: content.hasNextPage, 
                prevLink, 
                nextLink}
        }
        catch(err){
            console.log(err);
            return {status:'error', message:"Can't reach products"}
        }

    } 

    async add(title,description,price,code,stock, category, status = true, thumbnails = []){
        const newProduct= this.#newProduct(title,description,price,code,stock, category, status, thumbnails)
        console.log(newProduct);
        const errors = await this.#errorCheck(newProduct,"add")
        console.log(errors);
        return errors.length == 0 ? (await productsModel.create(newProduct),newProduct) : {error: errors}

    }

    getById = async (id) => {
            if (id.length == 24){
              return await productsModel.findOne({_id:id}).lean().exec() || "Product Id not found";  
            } else {
                return 'ID must be 24 characters'
            }
        }    

    updateById = async (id,title,description,price,code,stock, category, status = true, thumbnails = []) => {
        if (id.length != 24) return {error: "ID must be 24 characters"} 
        const updatedProduct= this.#newProduct(title,description,price,code,stock, category, status, thumbnails)
        const errors = await this.#errorCheck(updatedProduct, "update")
        if (!await productsModel.findOne({_id:id})) errors.push("Product Id not found")
        return errors.length == 0 ? (await productsModel.updateOne({_id:id},updatedProduct),updatedProduct) : errors

    }   

    deleteById = async (id) => {
        if (id.length == 24){
            const productToDelete = await productsModel.findOne({_id:id})
        if (productToDelete) return (productToDelete, await productsModel.deleteOne({_id:id}),{message: "Success"})
        else return {error: "Product Id not found"} 
          } else {
              return {error:'ID must be 24 characters'}
          }

    }

    #newProduct(title,description,price,code,stock, category, status, thumbnails){
        const newProduct={
            title,
            description,
            price,
            thumbnails,
            code,
            stock,
            category,
            status
        }
        return newProduct;
    }

    async #errorCheck(newProduct, operation){
        const errors=new Array();
        if (operation == "add") {
            if(await productsModel.findOne({code:newProduct.code}) ) errors.push(`Code "${newProduct.code}" already exists`)
        }
        if (Object.values(newProduct).includes(undefined)) errors.push('There are empty fields.')
        return errors
    }

}

//module.exports = ProductManager;

export default ProductManager;