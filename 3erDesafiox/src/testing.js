 import { ProductManager } from './productManager.js';

 
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