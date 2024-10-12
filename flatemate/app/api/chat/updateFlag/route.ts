import { connect } from "@/db";
import messagedb from "@/db/Model/Message";
import { NextRequest, NextResponse } from "next/server";

export const POST=async(req:NextRequest)=>{
    try{

        await connect();
        const data=await req.json();
        await messagedb.findByIdAndUpdate(data?.id,{read:true});
        return NextResponse.json({
            message:"Successfully update the read count"

        },{
            status:200
        })

    }
    catch(err){
        return NextResponse.json({
            message:'not able to update the flag'

        },{
            status:500
        })
    }
}