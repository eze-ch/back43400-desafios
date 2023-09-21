//Generic
import express from 'express';
import handlebars from 'express-handlebars'//Importamos handlebars
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io' //Importamos socket

//DB Mongo
import '../src/db/dbConfig.js';
import { URI } from './utils.js'
import { __dirname } from './utils.js'
import MongoStore from 'connect-mongo';
import { Message } from '../src/db/models/messages.model.js';
import { MongoProductManager } from '../src/manager/mongoProductManager.js';

//Routes
import productsRouter from '../src/routes/products.router.js';
import cartsRouter from '../src/routes/carts.router.js'; 
import viewsRouter from '../src/routes/views.router.js'
import usersRouter from '../src/routes/user.router.js';


//Config EXPRESS server
const app = express();
const PORT = 8080
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));


// Config HANDLEBARS
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')


// Declaracion de variables
const productManagerInstance = new MongoProductManager();

//session
app.set('trust proxy', 1)
app.use(session({
    store: new MongoStore({
        mongoUrl: URI,
        mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
        ttl: 600
    }),
    secret: "secret",
    resave:false,
    saveUninitialized:false,
}))


// ENDPOINTS
//app.get('/', (req, res) => { res.send('Ecommerce Backend - ECH') }); //Mensaje al acceder a la raíz de la app

app.use('/', viewsRouter)
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/user',usersRouter);
app.get('/chat', (req, res) => { res.render('chat', { messages: [] }) });

//app.use ('/api/views/products', productsRouter);
//app.use('api/views/delete/:id', viewsRouter)


//Declaración de puerto variable + llamado al puerto 
const httpServer = app.listen(PORT, () => {
  console.log(`Escuchando al puerto ${PORT}`)
})

//Socket y eventos
const socketServer = new Server(httpServer);
socketServer.on('connection', (socket) => {
  console.log('Cliente conectado', socket.id);
  socket.on('disconnect', () => {
    console.log(`Cliente desconectado`);
  });

  socket.on('addProduct', (newProduct) => {
    const addedProduct = productManagerInstance.addProduct(newProduct);
    const allproducts = productManagerInstance.loadProducts();
    socketServer.emit('addProduct', addedProduct);
    //socketServer.emit('updateProductList', allproducts);  
  });

  socket.on('deleteProduct', (productId) => {
    productManagerInstance.deleteProduct(Number(productId));
    const allproducts = productManagerInstance.loadProducts();
    socketServer.emit('productDeleted', productId); 
    //socketServer.emit('updateProductList', allproducts);
  });

  socket.on('chatMessage', async (messageData) => {
    const { user, message } = messageData;
    const newMessage = new Message({ user, message });
    await newMessage.save();

    // Emitir el mensaje a todos los clientes conectados
    socketServer.emit('chatMessage', { user, message });

    console.log(`Mensaje guardado en la base de datos: ${user}: ${message}`);
  });

});

