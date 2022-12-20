import {Router} from 'express'

const router = Router()


import CartManager from '../cartManager.js';
const manager = new CartManager('./cart.json');

router.get('/', async (req, res) => {
    const carts = await manager.get()
    res.send({carts})
})
router.post('/', async (req, res) => {
    const newCart = await manager.add()
    res.send({newCart})
})

router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid
    const selCart = await manager.getById(cartId)
    res.send({selCart})
})


router.post('/:cid/product/:pid', async (req, res) => {
    const productID = parseInt(req.params.pid)
    const cartID = req.params.cid
    await manager.addById(cartID,productID,1)
    const selCart = await manager.getById(cartID)
    res.send({selCart})
})

export default router;