import mongoose from "mongoose";
const matchedRoom=new mongoose.Schema({
    renterId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    takerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    roomId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Rooms'
    },
    isapproved:{
        type:Boolean,
        default:false

    }
})
const match=mongoose.models.MatchRoom || mongoose.model('MatchRoom',matchedRoom);
export default match;