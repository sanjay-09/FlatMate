import conversation from "@/db/Model/Conversation";
import messagedb from "@/db/Model/Message";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/db";

export const GET=async(req:NextRequest)=>{
    try{
        const {searchParams}=new URL(req.url);
        const userId=searchParams.get("userId");
        const receiverId=searchParams.get("receiverId");
        await connect();
        const conversationIdPresent=await conversation.find({
            participants:{
                $all:[userId,receiverId]
            }
            
        })
       
        //@ts-ignore
       
       const all= await messagedb.updateMany({conversationId:conversationIdPresent,read:false},{$set:{read:true}});

        return NextResponse.json({
            message:"Successfully update the read count",
            all
        },{
            status:200
        })
    }
    catch(err){
        return NextResponse.json({
            message:"Not able to update the data"
        },{
            status:500
        })

    }

}