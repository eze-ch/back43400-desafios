import mongoose, { Types, isObjectIdOrHexString } from "mongoose";

const cartSchema=new mongoose.Schema({
    
    products:{
        type:Array,
        default:[]
    }
    
})



const Cart = mongoose.model('Cart', cartSchema);

export default Cart;