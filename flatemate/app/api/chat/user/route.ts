import {connect} from "@/db/index"
import { NextRequest, NextResponse } from "next/server"
import conversation from "@/db/Model/Conversation";
import messagedb from "@/db/Model/Message";
export const GET=async(req:NextRequest)=>{
    const start=Date.now();
    const {searchParams}=new URL(req.url);
    const userId=searchParams.get("userId");
    const receiverId=searchParams.get("receiverId");
    console.log("userr->>",userId,receiverId);
    try{
        await connect();
        const isConversationPresent=await conversation.findOne({
            participants:{
                $all:[userId,receiverId]
            }
        })
        console.log("isConversationPresent",isConversationPresent);
      
        if(!isConversationPresent){
            return NextResponse.json({
                message:"Conversation not initiated"
            },{
                status:500
            })
        }
        const messages=await messagedb.find({
            conversationId:isConversationPresent

        })
      
        const newMessages=messages.map((m)=>{
            return {
                id:m.updatedAt,
                message:m.message,
                senderId:m.senderId,
                isSender:m.senderId===userId?'user':'other',
                read:m.read
            }
        });
        const end=Date.now();
        console.log("duration",end-start);

        return NextResponse.json({
            messages:newMessages
        },{
            status:200
        })

    }
    catch(err){
        console.log(err);
        return NextResponse.json({
            message:"Not able to connect to the db"
        },{
            status:500
        })

    }

}