import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        user:{
            type:String,
            require:true,
            unique:true
        },
        message:{
            type:String,
            require:true
        }
    },
    {
        timestamps: true
        //https://mongoosejs.com/docs/timestamps.html  - If you set timestamps: true, Mongoose will add two properties of type Date to your schema: createdAt ,updatedAt
    }
)

const Message = mongoose.model('Message', messageSchema);

export { Message };