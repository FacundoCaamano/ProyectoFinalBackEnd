import {Router} from 'express'

const router = Router()


import ProductManager from '../dao/manager/db/productManager.js';
const manager = new ProductManager('./productos.json');


router.get('/', async (req, res) => {
    
    let limit = req.query.limit
    let page = req.query.page
    let query = req.query.query
    let sort = req.query.sort

    const products = await manager.get(limit, page, sort, query)
    res.render('product-pages',products)
    
        req.io.emit('update', products) 

})


router.post('/', async (req, res) => {
    const {title, description, price, thumbnails, code, stock, category, status} = req.body
    const addProduct = await manager.add(title, description, price, code, stock, category, status, thumbnails)
    req.io.emit('update',await manager.get())
    res.send(addProduct)
})

router.get('/:pid', async (req, res) => {
    const id = req.params.pid
    const product = await manager.getById(id)
    res.render('product-detail',{ product})
    
})


router.put('/:pid', async (req, res) => {
    const id = req.params.pid
    const {title, description, price, thumbnails, code, stock, category, status} = req.body
    const updateProduct = await manager.updateById(id, title, description, price, code, stock, category, status, thumbnails)
    req.io.emit('update', await manager.get())
    res.send(updateProduct)
})

router.delete('/:pid', async (req, res) => {
    const id = req.params.pid
    const deleteProduct =  await manager.deleteById(id)
    req.io.emit('update', await manager.get())
    res.send(deleteProduct)
})
router.get('/productosTR', async (req, res) =>{
    const products = await manager.get()
    res.render('productosTR',
    {
        title: "lista",
        products: products.payload
    })

})

router.get('/home', async (req, res) =>{
    const products = await manager.get()
    res.render('home',
    {
        title: "lista",
        products: products.payload
    })
})


export default router;