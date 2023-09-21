import { Router } from "express";
import { MongoProductManager } from '../manager/mongoProductManager.js';
import { MongoCartManager } from '../manager/mongoCartManager.js';
import { UserManager } from "../manager/userManagerMongo.js";
import session from "express-session";  
import MongoStore from "connect-mongo";
import { URI } from '../utils.js';

const router = Router();
const productManagerInstance = new MongoProductManager(); 
const cartManagerInstance = new MongoCartManager(); 
const userManagerInstance = new UserManager();

/* router.use(session({
  store: MongoStore.create({
      mongoUrl: URI,
      mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
      ttl: 600
  }),
  secret: "secret",
  resave:false,
  saveUninitialized:false,
})) */

router.get('/', async (req, res) => {
  res.render('login')
});

router.get('/register', async (req, res) => {
  res.render('sesion')
});

router.get('/login', async (req, res) => {
  res.render('login');
});

router.get('/index', async (req, res) => {
  const email = req.session.user['email']
  console.log(`email logueado: ${email}`)

  let admin = "USER"

  if (!email) {
      res.redirect('/login')
  } else{
  const user = await userManagerInstance.findUser(email)
  console.log(user)
  //if (user) {
    admin = user.isAdmin ? "ADMIN" : "USER"
    const cook = [{
        first_name: user.first_name,
        rol: admin
    }]
    res.render("index", { cook })
  }
})

 // Renderizará la vista API/VIEWS/ correspondiente al "Home" y pasará el listado de productos completo.
 /* router.get('/', async (req, res) => {
  try {
      const products = await productManagerInstance.getProducts();
      res.render('home', { products });
  } catch (error) {
      res.status(500).json({ error: 'Error al obtener listado de productos' });
  }
}); */

//Renderizará la nueva ruta de PRODUCTS
router.get('/products', async (req, res) => {
try {
    
/*     const { limit = 10, page = 1, query, sort } = req.query;

    const productsPaginated = await fetch(`http://localhost:8080/api/products?query=${query}&sort=${sort}&limit=${limit}&page=${productsPaginated.nextPage}`)
    //const products = paginatedProd.payload

    console.log(productsPaginated)

    productsPaginated.hasPrevPage ? `/products?query=${query}&sort=${sort}&limit=${limit}&page=${productsPaginated.prevPage}` : null
    productsPaginated.hasNextPage ? `/products?query=${query}&sort=${sort}&limit=${limit}&page=${productsPaginated.nextPage}` : null */


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

    const products = {
      status: 'success',
      payload: productsPaginated.docs, 
      totalPages: productsPaginated.totalPages,
      prevPage: productsPaginated.hasPrevPage ? productsPaginated.prevPage : null,
      nextPage: productsPaginated.hasNextPage ? productsPaginated.nextPage : null,
      page: productsPaginated.page,
      hasPrevPage: productsPaginated.hasPrevPage,
      hasNextPage: productsPaginated.hasNextPage,
      prevLink: productsPaginated.hasPrevPage ? `/products?query=${query}&sort=${sort}&limit=${limit}&page=${productsPaginated.prevPage}` : null,
      nextLink: productsPaginated.hasNextPage ? `/products?query=${query}&sort=${sort}&limit=${limit}&page=${productsPaginated.nextPage}` : null,
    };

    res.render('products', { products });

} catch (error) {
    res.status(500).json({ error: 'Error al obtener y mostrar listado de productos' });
}
});


// Renderizará la vista API/VIEWS/REALTIMEPRODUCTS y mostrando el listado de productos en tiempo real, sumando o eliminando los ítems según las acciones ingresadas por forms.
router.get('/realtimeproducts', async (req, res) => {
  try {
      const products = await productManagerInstance.getProducts() ;
      res.render('realTimeProducts', { products }); 
  } catch (error) {
      res.status(500).json({ error: 'Error al obtener el listado de productos' });
  }
});


//Renderizará automáticamente el listado nuevamente, quitando el producto eliminado por ID.
router.delete('/delete/:id', async (req, res) => {
  const productId = req.params.id;

  try {
      const deletedProduct = await productManagerInstance.deleteProduct(productId);
  if (deletedProduct) {
    socketServer.emit('deleteProduct', productId);
    res.status(200).json({ message: `Producto ID ${productId} eliminado.` });
  } else {
    res.status(404).json({ error: `No se encontró producto con el ID ${productId}.` });
  } 
  } catch (error) {
  res.status(500).json({ error: 'Error al eliminar el producto.' });
}
});

// Nueva ruta para visualizar un carrito específico con sus productos utilizando populate
router.get('/carts/:cid', async (req, res) => {
const cartId = req.params.cid;
try {
  const cart = await cartManagerInstance.getPopulatedCartById(cartId);
  res.render('carts', { products: cart.products });
} catch (error) {
  res.status(500).json({ error: 'Error al obtener el carrito' });
}
});


export default router;