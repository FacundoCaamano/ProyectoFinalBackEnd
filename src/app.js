import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import { Server } from 'socket.io';
import mongoose from 'mongoose'
import chatRouter from './routes/chat.router.js';
import messagesModel from './dao/models/messages.model.js';
import cartsRouter from './routes/carts.router.js';
import productsRouter from './routes/products.router.js';

const app = express();

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use(express.static(__dirname + '/public'))

app.engine('handlebars' , handlebars.engine())

app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

const uri = 'mongodb+srv://FacundoCaamano:LyMXNeB3ETCiOiyu@cluster0.iwosz6p.mongodb.net/?retryWrites=true&w=majority'

mongoose.set({strictQuery: true})
mongoose.connect(uri,{dbName: 'ecommerce'}, async (error)=>{
    if (!error){
        console.log('Conectado a la base de datos');
        const httpServer = app.listen(8080, ()=>{
            console.log("Servidor corriendo...");
        });

        const socketServer = new Server(httpServer)

        let messages = []

        socketServer.on('connection', socket =>{
            socket.on('msg_front', data => console.log(data));
            socket.emit('msg_back',"Conectado al servicio")
            

            socket.on('session', async data =>{
                messages = await messagesModel.find().lean().exec();
                socketServer.emit('first',messages)
            })


            socket.on('message', async data=>{
                await messagesModel.create(data)
                messages = await messagesModel.find().lean().exec();
                socketServer.emit('logs',messages)
                })
        })

        app.use((req,res,next)=>{
            req.io = socketServer
            next()
        })
        app.use('/api/chat', chatRouter)
        app.use('/api/products', productsRouter)
        app.use('/api/carts', cartsRouter)

    } else {    console.log("ups!! no se pudo conectar a la base de datos");
            }
} )
