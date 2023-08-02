import express from 'express';
import { __dirname } from './utils.js';

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+'/public')); 


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

//Mensaje para cualquier endpoint no existente
app.get('/*', (req, res) => { // para cualquier ruta no definida
  res.send("Upss .. no existe esa ruta");
})

app.listen(8080, () => {
  console.log(`Servidor Express escuchando en el puerto 8080`);
});


