import express from 'express'

import productRouter from './routes/product.router.js'
import cartRouter from './routes/cart.router.js'


const app = express()

app.use(express.json())

app.use('/static',express.static('public'))
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)

app.use('/', (request,response) => response.send('home'))





const server= app.listen(8080,console.log('servidor corriendo'))

server.on('error',()=>console.log('error '))