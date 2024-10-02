import { connect } from "@/db";
import room from "@/db/Model/room";

import { NextRequest, NextResponse } from "next/server"

export const GET=async(req:NextRequest)=>{
    const {searchParams}=new URL(req.url);
    const roomId=searchParams.get("id");
   try{
    await connect();
    const data=await room.findById(roomId).populate("userId");
    return NextResponse.json({
        message:'successfully fetched the room',
        data:data
    },{
        status:200
    })
   }
   catch(err){
    return NextResponse.json({
        message:'Not able to fetch the data',
       
        
    },{
        status:500
    })

   }
    

    
}