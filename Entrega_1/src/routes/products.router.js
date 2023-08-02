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
router.post('/', async (req, res) => {
    try {
        const product = req.body;
        const newProd = await productManagerInstance.addProduct(product);
        res.send(newProd);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Endpoint PUT /api/products/:pid   (Actualizará un producto)
router.put('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const updatedFields = req.body; 
        const updatedProd = await productManagerInstance.updateProduct(productId, updatedFields);
        res.status(200).json(updatedProd);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Endpoint DELETE /api/products/:pid (Eliminará un producto)
router.delete('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        await productManagerInstance.deleteProduct(productId);
        res.status(200).json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

export default router;