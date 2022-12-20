import {Router} from 'express'
import CartManager from '../manager/Cart_manager.js'

const cartManager=new CartManager('carts.json')
const router = Router()




router.get('/', async (request,response)=>{
    const carts  = await cartManager.get()
    
    response.json({carts})
})
router.get('/:id', async (request,response)=>{
    const id =parseInt(request.params.id)
    const cart  = await cartManager.getByID(id)
    
    response.json({cart})
})

router.post('/', async(request,response)=>{
    
    const newCart= await cartManager.create()
    

    response.send({status:'success', newCart}) 
})

router.post('/:cid/product/:pid', async (request,response)=>{
    const cartID = parseInt(request.params.cid)
    const productID = parseInt(request.params.pid)

    const cart  = await cartManager.addProduct(cartID, productID)
   
    response.json({status:'success', cart })  
})

export default router 