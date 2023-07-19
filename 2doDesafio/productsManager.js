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
      if (productUpdate.id) {
        console.log("No se puede modificar el valor de ID")
        return null
      }
      const products= await this.getProducts()
      const usuarioIndex = usuariosPrev.findIndex((u) => u.id === id)
      if (usuarioIndex === -1) {
        return 'No hay un usuario con ese id'
      }
      const usuario = usuariosPrev[usuarioIndex]
      //const usuarioUpdate = {...usuario,...obj}
      usuariosPrev[usuarioIndex] = { ...usuario, ...obj }
      await fs.promises.writeFile(this.path, JSON.stringify(usuariosPrev))

    } catch (error) {
      return error
    }
  }


  async deleteUser(id) {
    try {
      const usuariosPrev = await this.getUsers()
      const nuevoArregloUsuarios = usuariosPrev.filter((u) => u.id !== id)
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(nuevoArregloUsuarios)
      )
    } catch (error) {
      return error
    }
  }


} //end Class ProductManager
  
////////////////////////////////////////////////////////////////////////////////


  //TESTING
  console.log("\n")

  //instance creation of ProductManager
  const productManager = new ProductManager();

  //call method getProduct without added products to show empty array
  console.log("ARRAY DE PRODUCTOS VACIO")
  console.log("productos cargados:", productManager.getProducts());
  console.log("\n")

  //products creations - IDs will be generated automatically in the class
  productManager.addProduct({
    title: "Producto 1",
    description: "Descripcion 1",
    price: 1000,
    thumbnail: "img1",
    code: "p1",
    stock: 10,
  });
  productManager.addProduct({
    title: "Producto 2",
    description: "Descripcion 2",
    price: 2000,
    thumbnail: "img2",
    code: "p2",
    stock: 20,
  });
  productManager.addProduct({
    title: "Producto 3",
    description: "Descripcion 3",
    price: 3000,
    thumbnail: "img3",
    code: "p3",
    stock: 30,
  });

  //call method getProduct with added products to show array
  console.log("\n")
  console.log("ARRAY DE PRODUCTOS CREADOS")
  console.log("productos cargados:", productManager.getProducts());
  console.log("\n")

  //product created with an existing code - creation will be rejected
  productManager.addProduct({
    title: "Producto X",
    description: "Descripcion X",
    price: 1000,
    thumbnail: "imgX",
    code: "p1",
    stock: 10,
  });
  console.log("\n")
  
  //search a product by ID - result with nonexistent ID
  console.log(productManager.getProductById(5))
  console.log("\n")
  
  //search a product by ID - result with existent ID
  console.log(productManager.getProductById(3))