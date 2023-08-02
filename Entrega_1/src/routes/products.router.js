//Router para manejar todos los endpoint asociados a los productos.
import { Router } from "express";
import { ProductManager } from "../productManager.js";

const router = Router();
const productManagerInstance = new ProductManager('./products.json');


//Todos los ENDPOINTS empiezan con /api/products

//Endpoint GET /api/products obtiene todos los productos o una cantidad definida de productos según límite fijado (el null indica que NO hay límite alguno)
router.get('/', async (req,res) =>{
    try{
        const products = await productManagerInstance.getProducts();

        //Verificación de límite al listar los productos
        const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
        console.log(limit);

        //Devolver el listado con tods los productos o el límite que se haya ingresado
        const response = products.slice(0, limit);

        //res.status(200).json({message: 'Productos encontrados', response})
        res.status(200).json(response);
        
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener listado de productos' });
    }
});

//Endpoint GET /api/products/:pid para obtención de productos por su ID
router.get('/:pid', async (req, res) => {
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


// Endpoint POST /api/products .Permite adicionar un nuevo producto
router.post('/', (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } = req.body;
  const product = {
    title,
    description,
    code,
    price,
    status: true, // Siguiendo el requerimiento se aplica el status TRUE por defecto
    stock: stock, //VER DE SACAR stock:
    category,
    thumbnails: thumbnails ? thumbnails.split(',') : [], 
  };

  const newProduct = productManagerInstance.addProduct(product);
  if (newProduct) {
    res.status(201).json(newProduct);
  } else {
    res.status(400).json({ error: 'No se pudo agregar el producto' });
  }
});

// Endpoint PUT /api/products/:pid   (Actualizará un producto)
router.put('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);
  const updatedFields = req.body; 
  await productManagerInstance.updateProduct(productId, updatedFields);
  res.json({ message: 'Producto actualizado exitosamente' });
});

// Endpoint DELETE /api/products/:pid (Eliminará un producto)
router.delete('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);
  await productManagerInstance.deleteProduct(productId);
  res.json({ message: 'Producto eliminado exitosamente' });
});


export default router;