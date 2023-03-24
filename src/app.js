import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import chatRouter from './routes/chat.router.js'
import viewsRouter from './routes/views.router.js'
import { MessageService } from './repositories/index.js'
import config from './config/config.js'
import cartsRouter from './routes/carts.router.js'
import productsRouter from './routes/products.router.js'
import sessionRouter from './routes/session.router.js'
import cookieParser from 'cookie-parser'
// import session from 'express-session'
// import MongoStore from 'connect-mongo'
import passport from 'passport'
import initializePassport from './config/passport.config.js'
import __dirname from './utils.js'

const app = express()

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use(express.static(__dirname + '/public'))

app.engine('handlebars', handlebars.engine())

app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(cookieParser('mySecret'))

// app.use(session({
//   store: MongoStore.create({
//     mongoUrl: config.MONGO_URI,
//     dbname: config.MONGO_DB_NAME
//   }),
//   secret: 'mySecret',
//   resave: true,
//   saveUninitialized: true
// }))

mongoose.set({ strictQuery: true })
mongoose.connect(config.MONGO_URI, {
  dbname: config.MONGO_DB_NAME
}, async (error) => {
  if (!error) {
    console.log('Conectado a la base de datos')
    const httpServer = app.listen(config.PORT, () => {
      console.log('Servidor corriendo...')
    })

    const socketServer = new Server(httpServer)

    let messages = []

    socketServer.on('connection', socket => {
      socket.on('msg_front', data => console.log(data))
      socket.emit('msg_back', 'Conectado al servicio')

      socket.on('session', async data => {
        messages = await MessageService.get()
        socketServer.emit('first', messages)
      })

      socket.on('message', async data => {
        await MessageService.create(data)
        messages = await MessageService.get()
        socketServer.emit('logs', messages)
      })
    })

    app.use((req, res, next) => {
      req.io = socketServer
      next()
    })

    initializePassport()
    app.use(passport.initialize())

    app.use('/api/products', productsRouter)
    app.use('/api/carts', cartsRouter)
    app.use('/api/chat', chatRouter)
    app.use('/session', sessionRouter)
    app.use('/views', viewsRouter)

    app.get('/', (req, res) => {
      res.redirect('views/products')
    }
    )
  } else {
    console.log('ups!! no se pudo conectar a la base de datos')
  }
})
