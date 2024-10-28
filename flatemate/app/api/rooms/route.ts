import room from "@/db/Model/room";
import { connect } from "@/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { useState } from "react";


export const POST=async(req:NextRequest)=>{
    
    const data=await req.json();
  
    
   try{
    await connect()
   const roomCreated=await room.create(data);
    const rooms=await room.findById(roomCreated._id).populate("userId");
    return NextResponse.json({
        message:'Successfull created the room request',
        data:rooms
    },{
        status:200
    })
   }
    catch(err){
        return NextResponse.json({
            message:err


        },{
            status:500
        })
    
    }
    


}

export const GET=async()=>{

    try{
        await connect();
    const data=await room.find({
        isavail:true
    })
    return NextResponse.json({
        message:'fetched the avaiable rooms',
        data:data

    },{
        status:200
    })
    
    }
    catch(err){
        return NextResponse.json({
            message:'not able to fetch the rooms'
        },{
            status:500
        })

    }



}