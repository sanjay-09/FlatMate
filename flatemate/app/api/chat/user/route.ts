import {connect} from "@/db/index"
import { NextRequest, NextResponse } from "next/server"
import conversation from "@/db/Model/Conversation";
import messagedb from "@/db/Model/Message";
export const GET=async(req:NextRequest)=>{
    const {searchParams}=new URL(req.url);
    const userId=searchParams.get("userId");
    const receiverId=searchParams.get("receiverId");
    try{
        await connect();
        const isConversationPresent=await conversation.find({
            participants:{
                $all:[userId,receiverId]
            }
        })
      
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
        console.log("mm->",messages);
        const newMessages=messages.map((m)=>{
            return {
                id:m.updatedAt,
                message:m.message,
                senderId:m.senderId,
                isSender:m.senderId===userId?'user':'other',
                read:m.read
            }
        });

        return NextResponse.json({
            message:"Able to fetch the data",
            conversationData:isConversationPresent,
            messages:newMessages
        })

    }
    catch(err){
        return NextResponse.json({
            message:"Not able to connect to the db"
        },{
            status:500
        })

    }

}