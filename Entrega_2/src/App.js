import express from 'express';
import handlebars from 'express-handlebars'//Importamos handlebars
import { Server } from 'socket.io' //Importamos socket
import '../src/db/dbConfig.js';

import { __dirname } from './utils.js'

import productsRouter from '../src/routes/products.router.js';
import cartsRouter from '../src/routes/carts.router.js'; 
import viewsRouter from '../src/routes/views.router.js' 

import { Message } from '../src/db/models/messages.model.js';
import { MongoProductManager } from '../src/manager/mongoProductManager.js';


//Configs EXPRESS
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));


// Config de HANDLEBARS
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')


// Declaracion de variables
const productManagerInstance = new MongoProductManager();


//Routes viewRouter
app.get('/', (req, res) => { res.send('Ecommerce Backend - ECH') }); //Mensaje al acceder a la raíz de la app

app.use('/api/views', viewsRouter)
app.use('api/views/delete/:id', viewsRouter)

app.use('/api/products', productsRouter);
app.use ('/api/views/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/chat', (req, res) => { res.render('chat', { messages: [] }) });


//Declaración de puerto variable + llamado al puerto 
const PORT = 8080
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

