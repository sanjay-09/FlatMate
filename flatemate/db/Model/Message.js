import mongoose from "mongoose";

const messageSchema=new mongoose.Schema({
    conversationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Conversation"
    },
    senderId:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }
},{
    timestamps:true
})
const messagedb=mongoose.models.Message || mongoose.model("Message",messageSchema);
export default messagedb;
