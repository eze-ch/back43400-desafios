import mongoose, { Types, isObjectIdOrHexString } from "mongoose";

const cartSchema=new mongoose.Schema({
    
    products: [
        {
          product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // va a ser un arreglo de IDs que hace referencia a la collection Product
          quantity: { type: Number },
        },
      ],
    
})



const Cart = mongoose.model('Cart', cartSchema);

export default Cart;