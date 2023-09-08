//Creamos un nuevo manager de PRODUCTOS para manejar productos con MONGO/MONGOOSE

import { Product } from '../db/models/product.model.js';


class MongoProductManager {

  //agregar JSON de productos
  async addJSON(products) {
    try {
      await Product.create(products)
      return 'products added'
    } catch (error) {
      return error
    }
  }

  //Agregar productos
  async addProduct(product) {
    try {
      const newProduct = new Product(product);
      await newProduct.save();
      return newProduct;
    } catch (error) {
      console.log('Error al agregar producto', error.message);
      throw new Error('Error al agregar producto');
    }
  }
  
  //Obtener productos - metodo anterior sin paginacion
/*   async getProducts() {
    try {
      const products = await Product.find();
      return products;
    } catch (error) {
      console.log('Error al obtener productos', error.message);
      throw new Error('Error al obtener productos');
    }
  } */

  //Obtener cantidad de documentos (productos) en DB 
  async getProductsCount(queryOptions = {}) {
    return await Product.countDocuments(queryOptions);
  }
  
  //Obtener productos con paginacion
  async getProducts(queryOptions = {}, sortOptions = {}, limit = 10, page = 1) {
    //en queryOptions vienen los paramentros de filtrado 
    const options = {
      sort: sortOptions,
      page: page,
      limit: limit,
      lean: true,
    };

    const result = await Product.paginate(queryOptions, options);
    return result;
  }


  //Obtener productos por ID
  async getProductById(id) {
    try {
      const product = await Product.findById(id);
      return product;
    } catch (error) {
      console.log('Error al obtener producto por ID', error.message);
      throw new Error('Error al obtener producto por ID');
    }
  }

  //Actualizar producto
  async updateProduct(id, updatedFields) {
    try {
      const product = await Product.findByIdAndUpdate(id, updatedFields, { new: true });
      return product;
    } catch (error) {
      console.log('Error al actualizar producto', error.message);
      throw new Error('Error al actualizar producto');
    }
  }
  
  //Eliminar producto por id
  async deleteProduct(id) {
    try {
      const deletedProduct = await Product.findByIdAndDelete(id);
      return deletedProduct;
    } catch (error) {
      console.log('Error al eliminar producto', error.message);
      throw new Error('Error al eliminar producto');
    }
  }
}

export {MongoProductManager} ;
