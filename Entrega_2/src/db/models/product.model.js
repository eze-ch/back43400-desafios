import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    stock:{
        type:Number,
        required:true,
        default:0
    },
    code:{
        type:String,
        required:true,
        unique:true
    },
    status:{
        type:String,
        default:true
    },
    category:{
        type:String,
        required:true
    },
    thumbnail:{
        type:String
    },
    description:{
        type:String,
        required:true
    }
})

const Product = mongoose.model('Product', productSchema);

export { Product };
