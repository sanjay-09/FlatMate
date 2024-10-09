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

    console.log("isConversationPresent",isConversationPresent);
    const newConversation:{senderId:string | null,receiverId:string,message:string,updatedAt:Date}[]=isConversationPresent.map((obj)=>{
        return {
            senderId:userId,  //97
            receiverId:obj.participants[0]==userId?obj.participants[1]:obj.participants[0],  //89
            message:obj.lastMessage,
            updatedAt:obj.updatedAt
        }
    })
    console.log("ddd-->",newConversation);
    const usersData=[];
   try{
    for(let i=0;i<=newConversation.length-1;i++){
        const { senderId, receiverId } = newConversation[i];
                //97       //89
        const [response1,response2]=await Promise.all([
            await user.findById(senderId!),await user.findById(receiverId)
        ])
        usersData.push({
            senderId,  //97 
            receiverId,  //89
            senderUserData:response1,  //97 
            receiverUserData:response2,  //89
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