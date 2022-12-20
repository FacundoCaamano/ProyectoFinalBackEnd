import {Router} from 'express'
import  FileManager from '../manager/File_manager.js'


const router = Router()

const fileManager=new FileManager('product.json') 


router.get('/', async (request,response)=>{
    const products  = await fileManager.get()
    
    response.json({products})
})

router.post('/', async(request,response)=>{
    const product =request.body
    const productAdded= await fileManager.add(product)
    

    response.send({status:'success', productAdded})
})

router.put('/:pid', async(request,response)=>{
    const id = parseInt(request.params.pid)
    const productToUpdate =request.body

    const product  = await fileManager.getById(id)

    if(!product) return response.status(404).send('Product not found')

    for (const key of Object.keys(productToUpdate)){
        product[key]=productToUpdate[key]
    }

     await fileManager.update(id, product)
    

    response.json({status:'success', product})
})

export default router 