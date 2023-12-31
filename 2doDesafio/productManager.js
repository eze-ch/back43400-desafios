const fs = require('fs')

// CLASS TO HANDLE PRODUCTS WITH FILESYSTEM HANDLING
class ProductManager {

  //products creator - init empty array
  constructor(path) {
    this.path = path
  }

  //method to get products from file and return product array
  async getProducts() {
    try {
      if (fs.existsSync(this.path)) {
        const archiveInfo = await fs.promises.readFile(this.path, 'utf-8')
        return JSON.parse(archiveInfo) // convert string json info to object
      } else {
        return [] // return empty array. So allways return the same type data
      }

    } catch (error) {
      return error
    }
  }

  //method to add a new product to the filesystem
  //como no puedo ir sumando datos al archivo, debo traer todo el archivo, crear un objeto, agregar el nuevo producto y volver a guardar. El metodo fs.append no se puede utilizar porque pega sobre la informacion ya existente, no lo mete en el array de objetos 
  async addProduct(product) {
    try {
      const products = await this.getProducts()

      //validations
      //verify that no product repeat code
      if (products.some(p => p.code === product.code)) {
        console.log(`No se puede crear el producto. Ya existe otro con el código --> ${product.code}`);
        return;
      }
      //verify that no field is empty
      if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
        console.log("No se puede crear el producto. Todos los campos son requeridos");
        return;
      }

      //create ID product
      let id
      if (!products.length) {
        id = 1
      } else {
        id = products[products.length - 1].id + 1
      }

      //add new product into array and write file
      products.push({ ...product, id })
      await fs.promises.writeFile(this.path, JSON.stringify(products))
      console.log(`Producto creado: ${product.title}`);

    } catch (error) {
      return error
    }
  }
  
  //method to generate an unique ID product automatically
  generateProductId() {
    return;
  }

  //method to find product by ID
  async getProductById(id) {
    try {
      const products = await this.getProducts()
      const product = products.find((p) => p.id === id)
      if (product) {
        console.log(`Producto con ID ${id} encontrado.`);
        return product;
      } else {
        console.log(`Error. Producto con ID ${id} no existe.`);
        return null;
      }

    } catch (error) {
      return error
    }
  }
  
  //method to update a product selected by ID
  async updateProduct(id, prodUpdate) {
    try {
      if (prodUpdate.id) {
        console.log("No se puede modificar el valor de ID")
        return null
      }
      const products= await this.getProducts()
      const prodIndex = products.findIndex((p) => p.id === id)
      if (prodIndex === -1) {
        console.log(`Error. Producto con ID ${id} no existe.`);
        return null
      }
      const product = products[prodIndex]
      products[prodIndex] = { ...product, ...prodUpdate } //al hacer spread, los valores definidos en prodUpdate pisan los valores actuales del producto
      await fs.promises.writeFile(this.path, JSON.stringify(products))

      const modifyProduct = products.find((p) => p.id === id)
      console.log(`Producto con ID ${id} modificado.`);
      return modifyProduct

    } catch (error) {
      return error
    }
  }

  //method to delete a product selected by ID
  async deleteProduct(id) {
    try {
      const products = await this.getProducts()
      const prodIndex = products.findIndex((p) => p.id === id)
      if (prodIndex === -1) {
        console.log(`Error. Producto con ID ${id} no existe.`);
        return null
      }
      const newProductsArray = products.filter((p) => p.id !== id) // filtra todos los elementos que no tengan el ID pedido
      await fs.promises.writeFile(this.path, JSON.stringify(newProductsArray))
      console.log(`Producto con ID ${id} eliminado.`);
    } catch (error) {
      return error
    }
  }

} //end Class ProductManager
  
////////////////////////////////////////////////////////////////////////////////


  //TESTING

  async function test() {
    //instance creation of ProductManager
    const productManager = new ProductManager('productList.json');

    //call method getProduct without added products to show empty array
    console.log("\n")
    console.log("LLAMADA DE getProducts CON ARRAY VACIO")
    console.log("productos cargados:",await productManager.getProducts());

    //products creations - IDs will be generated automatically in the class
    console.log("\n")
    console.log("CREACION DE PRODUCTOS CON addProduct")
    await productManager.addProduct({
      title: "Producto 1",
      description: "Descripcion 1",
      price: 1000,
      thumbnail: "img1",
      code: "p1",
      stock: 10,
    });
    await productManager.addProduct({
      title: "Producto 2",
      description: "Descripcion 2",
      price: 2000,
      thumbnail: "img2",
      code: "p2",
      stock: 20,
    });
    await productManager.addProduct({
      title: "Producto 3",
      description: "Descripcion 3",
      price: 3000,
      thumbnail: "img3",
      code: "p3",
      stock: 30,
    });

    //call method getProduct with added products to show array
    console.log("\n")
    console.log("LLAMADA DE getProducts CON PRODUCTOS CREADOS")
    console.log("productos cargados:",await productManager.getProducts());

    //product created with an existing code - creation will be rejected
    console.log("\n")
    console.log("RESPUESTA DE addProducts AL CREAR UN PRODUCTO CON CODE REPETIDO")
    await productManager.addProduct({
      title: "Producto X",
      description: "Descripcion X",
      price: 1000,
      thumbnail: "imgX",
      code: "p1",
      stock: 10,
    });

    //search a product by ID - result with nonexistent ID
    console.log("\n")
    console.log("RESPUESTA DE getProductById AL BUSCAR UN ID INEXISTENTE")
    console.log(await productManager.getProductById(5))

    //search a product by ID - result with existent ID
    console.log("\n")
    console.log("RESPUESTA DE getProductById AL BUSCAR UN ID EXISTENTE")
    console.log(await productManager.getProductById(3))

    //update product by ID - result with nonexistent ID
    console.log("\n")
    console.log("RESPUESTA DE updateProduct AL BUSCAR UN ID INEXISTENTE")
    console.log(await productManager.updateProduct(7,{
      price: 5000,
    }))

    //update product by ID - result with existent ID
    console.log("\n")
    console.log("RESPUESTA DE updateProduct AL BUSCAR UN ID INEXISTENTE")
    console.log(await productManager.updateProduct(3,{
      title: "Producto Modificado",
      price: 8000,
      stock: 70,
    }))

    //update product by ID - result trying to update ID value
    console.log("\n")
    console.log("RESPUESTA DE updateProduct AL BUSCAR UN ID INEXISTENTE")
    console.log(await productManager.updateProduct(3,{
      title: "Producto Modificado",
      price: 8000,
      stock: 70,
      id: 2
    }))

    //delete product - result with nonexistent ID 
    console.log("\n")
    console.log("RESPUESTA DE deleteProduct AL BUSCAR UN ID INEXISTENTE")
    console.log(await productManager.deleteProduct(9))

    //delete product - result with existent ID 
    console.log("\n")
    console.log("RESPUESTA DE deleteProduct AL BUSCAR UN ID EXISTENTE")
    console.log(await productManager.deleteProduct(2))
}

test()

// node productManager.js