import fs from 'fs';

/* const filePath = 'products.json';

// Se verifica si el archivo existe, si no existe se crea.
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, '[]', 'utf-8');
  console.log(`Se ha creado el archivo ${filePath}`);
} */

// CLASS TO HANDLE PRODUCTS WITH FILESYSTEM HANDLING
class ProductManager {

  //products creator - init empty array
  constructor(path) {
    this.path = path
    console.log(this.path)
  }

  //method to get products from file and return product array
  async getProducts() {
    try {
      if (fs.existsSync(this.path)) {
        console.log("archivo encontrado");
        const archiveInfo = await fs.promises.readFile(this.path, 'utf-8')
        return JSON.parse(archiveInfo) // convert string json info to object
      } else {
        console.log("archivo NO encontrado");
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
      if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock || !product.category) {
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


export {ProductManager}
