import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

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
        unique:true // si la propiedad es unica, mongo automaticamente la indexa, mo hace falta especificarlo
    },
    status:{
        type:Boolean,
        default:true
    },
    category:{
        type:String,
        required:true
    },
    thumbnail:{
        type:[String]
    },
    description:{
        type:String,
        required:true
    }
})

productSchema.plugin(mongoosePaginate);
const Product = mongoose.model('Product', productSchema);

export { Product };
