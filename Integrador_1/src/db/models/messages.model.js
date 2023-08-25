import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({

user:{
    type:String,
    require:true,
    unique:true
},
message:{
    type:String,
    require:true
}

})

const Message = mongoose.model('Message', messageSchema);

export { Message };