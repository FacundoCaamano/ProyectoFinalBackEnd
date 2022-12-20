import {Router} from 'express'

const router = Router()


import ProductManager from '../productManager.js';
const manager = new ProductManager('./productos.json');


router.get('/', async (req, res) => {
    const products = await manager.get()
    let limit = req.query.limit
    if (!limit) res.send({products})
    else {
        const prodLimit = [];
        if (limit > products.length) limit = products.length;
        for (let index = 0; index < limit; index++) {
            prodLimit.push(products[index]);
        }
        res.send({prodLimit})
    }
})
router.post('/', async (req, res) => {
    const {title, description, price, thumbnails, code, stock, category, status} = req.body
    const addProduct = await manager.add(title, description, price, code, stock, category, status, thumbnails)
    res.send(addProduct)
})

router.get('/:pid', async (req, res) => {
    const id = req.params.pid
    const product = await manager.getById(id)
    res.send({product})
})


router.put('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid)
    const {title, description, price, thumbnails, code, stock, category, status} = req.body
    const updateProduct = await manager.updateById(id, title, description, price, code, stock, category, status, thumbnails)
    res.send(updateProduct)
})

router.delete('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid)
    const deleteProduct =  await manager.deleteById(id)
    res.send(deleteProduct)
})

export default router;