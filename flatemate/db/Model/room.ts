import mongoose from "mongoose";

const roomSchema=new mongoose.Schema({

    location:{
        type:String,
        required:true
    },
    contact:{
        type:String,
        required:true
    },
    images:{
        type:[String]
    },
    price:{
        type:Number,
        required:true
    },
    preference:{
        type:String,
        enum:['Male','female']
    },
    amenities:{
        type:['String']
    },
    description:{
        type:'String'
    },
    isavail:{
        type:'Boolean',
        default:true
    },
    size:{
        type:Number,
        requird:true
    },
    isApproved:{
        type:'Boolean',
        default:false

    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
})
const room=mongoose.models.Rooms || mongoose.model('Rooms',roomSchema)
export default room;