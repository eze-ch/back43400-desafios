//Router para manejar todos los endpoint asociados a los productos.
import { Router } from "express";
import { MongoProductManager } from '../manager/mongoProductManager.js';

import fs from 'fs'
import { __dirname } from '../utils.js'

const router = Router();
const productManagerInstance = new MongoProductManager();


//// para agregar json de estudiantes. Usar para cargar a mongoAtlas y luego comentar
/* router.get('/addJSON', async (req,res) => {
    const path = __dirname +'/products.json'
    console.log (path)
    const productsData = await fs.promises.readFile(path,'utf-8')
    await productManagerInstance.addJSON(JSON.parse(productsData))
    res.json({mensagge: 'Products added'})
}) */

// Endpoint GET /api/products (Traerá listados todos los productos)
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, query, sort } = req.query;

    let queryOptions = {};
    if (query) {
      queryOptions = {
        $or: [
          { title: { $regex: query, $options: 'i' } }, // Búsqueda por título (NO case sensitive)
          { category: { $regex: query, $options: 'i' } }, // Búsqueda por categoría (NO case sensitive)
        ],
      };
    }

    const sortOptions = {};
    if (sort === 'asc') {
      sortOptions.price = 1; // Orden ascendente por precio
    } else if (sort === 'desc') {
      sortOptions.price = -1; // Orden descendente por precio
    }

    const productsPaginated = await productManagerInstance.getProducts(queryOptions, sortOptions, limit, page);

    const response = {
      status: 'success',
      payload: productsPaginated.docs, 
      totalPages: productsPaginated.totalPages,
      prevPage: productsPaginated.hasPrevPage ? productsPaginated.prevPage : null,
      nextPage: productsPaginated.hasNextPage ? productsPaginated.nextPage : null,
      page: productsPaginated.page,
      hasPrevPage: productsPaginated.hasPrevPage,
      hasNextPage: productsPaginated.hasNextPage,
      prevLink: productsPaginated.hasPrevPage ? `/api/products?limit=${limit}&page=${productsPaginated.prevPage}&query=${query}&sort=${sort}` : null,
      nextLink: productsPaginated.hasNextPage ? `/api/products?limit=${limit}&page=${productsPaginated.nextPage}&query=${query}&sort=${sort}` : null,
    };

    res.json(response);
    //return response;
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener listado de productos' });
  }
});

// Endpoint GET /api/products/:pid (Traerá listado el producto por ID único)
router.get('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid; //Quitamos el parseint para que funcione Mongoose
    const product = await productManagerInstance.getProductById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto solicitado' });
  }
});

// Endpoint POST /api/products (Permite adicionar un nuevo producto)
router.post('/', (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } = req.body;
  const product = {
    title,
    description,
    code,
    price,
    status: true, // Siguiendo el requerimiento se aplica el status TRUE por defecto
    stock: stock,
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


// Endpoint DELETE /api/products/:pid (Eliminará un producto Entregable 3)
router.delete('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);
  await productManagerInstance.deleteProduct(productId);
  res.json({ message: 'Producto eliminado exitosamente' });
});


export default router;
