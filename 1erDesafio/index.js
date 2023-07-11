
// CLASS TO HANDLE PRODUCTS
class ProductManager {

  //products creator - init empty array
  constructor() {
    this.products = [];
  }

  //method to add a new product
  addProduct(product) {
    //validations
    //verify that no field is empty
    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
      console.log("No se puede crear el producto. Todos los campos son requeridos");
      return;
    }
    //verify that no product repeat code
    if (this.products.some(p => p.code === product.code)) {
      console.log(`No se puede crear el producto. Ya existe otro con el código --> ${product.code}`);
      return;
    }

    //generate automatically a new ID for this product
    product.id = this.generateProductId();
    this.products.push(product);
    console.log(`Producto creado: ${product.title}`);
  }
  
  //method to generate an unique ID product automatically
  generateProductId() {
    return this.products.length + 1;
  }

  //method to show products list
  getProducts() {
    return this.products;
  }

  //method to find product by ID
  getProductById(id) {
    const product = this.products.find(p => p.id === id);
    if (product) {
      console.log(`Producto con ID ${id} encontrado.`);
      return product;
    } else {
      console.log(`Error. Producto con ID ${id} no existe.`);
      return null;
    }
  }

}
  
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