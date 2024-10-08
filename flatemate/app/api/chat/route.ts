import { connect } from "@/db";
import conversation from "@/db/Model/Conversation";
import messagedb from "@/db/Model/Message";
import user from "@/db/Model/user";
import { NextRequest, NextResponse } from "next/server";

export const GET=async(req:NextRequest)=>{
    const {searchParams}=new URL(req.url);
    const userId=searchParams.get("userId");
    await connect();
    console.log("connected");
    const isConversationPresent=await conversation.find({
        participants:{
            $in:[userId]
        }
    })

    const newConversation:{senderId:string | null,receiverId:string,message:string,updatedAt:Date}[]=isConversationPresent.map((obj)=>{
        return {
            senderId:userId,
            receiverId:obj.participants[0]===userId?obj.participants[1]:obj.participants[0],
            message:obj.lastMessage,
            updatedAt:obj.updatedAt
        }
    })
    const usersData=[];
   try{
    for(let i=0;i<=newConversation.length-1;i++){
        const { senderId, receiverId } = newConversation[i];
        
        const [response1,response2]=await Promise.all([
            await user.findById(senderId!),await user.findById(receiverId)
        ])
        usersData.push({
            senderId,
            receiverId,
            senderUserData:response1,
            receiverUserData:response2,
            message:newConversation[i].message,
            updatedAt:newConversation[i].updatedAt
          

        })


    }
    

   }
catch(err){
    console.log(err);
    return NextResponse.json({
        error:"failed to fetch the user"
    })

}

    return NextResponse.json({
        length:newConversation.length,
        usersData,
       
        
    },{
        status:200
    })

}