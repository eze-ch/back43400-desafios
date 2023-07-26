import express from 'express';
import {ProductManager} from './productManager.js';

const app = express ();

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const productManagerInstance = new ProductManager('products.json')

//Mensaje al acceder a la raíz de la app
app.get('/', (req, res) => {
    res.send('Bienvenido al Testing del ProductManager');
  });

  
//Endpoint que obtiene todos los productos o una cantidad definida de productos según límite fijado (el null indica que NO hay límite alguno)
app.get('/products', async (req,res) =>{
    try{
        const products = await productManagerInstance.getProducts();

        //Verificación de límite al listar los productos
        const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
        console.log(limit);

        //Devolver el listado con tods los productos o el límite que se haya ingresado
        const response = products.slice(0, limit);

        //res.json({message: 'Productos encontrados', response})
        res.json(response);
        //res.send({response})
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener listado de productos' });
    }
});

//Endpoint para obtención de productos por su ID, para hacer la prueba manual reemplazar el :pid por el ID del producto.
app.get('/products/:pid', async (req, res) => {
    try {
      const productId = parseInt(req.params.pid);
      console.log(productId);
      const product = await productManagerInstance.getProductById(productId);
  
      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
  
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el producto solicitado' });
    }
});

//Mensaje para cualquier endpoint no existente
app.get('/*', (req, res) => { // para cualquier ruta no definida
  res.send("Upss .. no existe esa ruta");
})

app.listen(8080, () => {
  console.log(`Servidor Express escuchando en el puerto 8080`);
});