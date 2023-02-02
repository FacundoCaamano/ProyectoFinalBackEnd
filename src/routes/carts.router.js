import {Router} from 'express'

const router = Router()


import CartManager from '../dao/manager/db/cartManager.js';
const manager = new CartManager('./cart.json');

router.get('/', async (req, res) => {
    const carts = await manager.get()
    res.send(carts)
})
router.post('/', async (req, res) => {
    const newCart = await manager.add()
    res.send(newCart)
})

router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid
        const selCart = await manager.getById(cartId)
        res.render('cart-detail', selCart)
    } catch (error) {
        res.status(401).render('cart-detail', {status: 'error', error: 'Not found'})
    }
})


router.get('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid
        const productId = req.params.pid
        const newCart = await manager.addProductById(cartId,productId,1)
        res.send({status: 'success'})
    } catch (error) {
        res.status(401).send({status: 'error', message: error})
    }
    

})

router.delete('/:cid', async (req, res) =>{
    try{
        const cartId = req.params.cid
        const cleanedCart = await manager.cleanedCart(cartId)
        res.send({status: 'success', cleaned: cleanedCart})
    } catch (error) {
        res.status(401).send({status: 'error', error: 'Not found'})

    }
})

router.delete('/:cid/products/:pid', async (req, res) =>{
    try{
        const cartId = req.params.cid
        const prodId = req.params.pid
        const deletedProduct = await manager.deleteProduct(cartId, prodId)
        res.send({status: 'success', deleted: deletedProduct})
    } catch (error) {
        res.status(401).send({status: 'error', error: 'Not found'})

    }
})

router.put('/:cid', async (req, res) => {
    try{
        const cartId = req.params.cid
        const products = req.body
        const updatedCart = await manager.replaceCart(cartId,products)
        res.send({status: 'success', replaced: updatedCart})
    } catch (error) {
        res.status(401).send({status: 'error', error: 'Not found'})

    }
})

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid
        const prodId = req.params.pid
        const quantity = req.body.quantity
        const replacedQuantity = await manager.replaceProdQuantity(cartId, prodId, quantity)
        res.send({status: 'success', replacedQuantity: replacedQuantity})
    } catch (error) {
        res.status(401).send({status: 'error', error: 'Not found'})

    }

})


export default router;