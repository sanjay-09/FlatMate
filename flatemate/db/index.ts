import mongoose from "mongoose";
let isConnected=false;
export const connect=async()=>{
    await mongoose.connect("mongodb+srv://sanjuwatson0110:fodfEnhrWtV0Nl9r@cluster1.chpu5ky.mongodb.net/flatMate");
    
    
    isConnected=true;

}

