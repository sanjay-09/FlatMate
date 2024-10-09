import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { X, Send } from "lucide-react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Card, CardHeader, CardFooter, CardContent } from "./ui/card"
import { MessageEnhanced } from "./UserChat2"
import { Message } from "./UserChat"
import { useEffect, useState } from "react"
import {socket} from "@/app/Client/socket"
import messagedb from "@/db/Model/Message"

export const UserChat3=({selectedUser,userId,closeChat}:{selectedUser:MessageEnhanced,userId:string,closeChat:()=>void})=>{
    const [chatInput,setChatInput]=useState<string>("");
    const [messages,setMessages]=useState<Message[]>([]);
    console.log("pt",messages);

    useEffect(()=>{
        console.log("usee------------->");
        socket.emit("join",userId);
        socket.on("receiveMessage",({senderId,message,id})=>{
          console.log("messageReceived---->");



            setMessages((prev)=>{
                return [
                    ...prev,
                    {
                        id:Date.now(),
                        message:message,
                        senderId:senderId,
                        isSender:'other'
                    }
                ]
            })
            console.log(messages);

        });
        fetchData();

        return ()=>{
          
        }

    },[]);
    
    
    const fetchData=async()=>{

        const data=await fetch(`api/chat/user?userId=${userId}&receiverId=${selectedUser.id}`);
        if(!data.ok){
            return;

        }
        const response=await data.json();
        console.log("response--------->",response)
        setMessages(response.messages);

    }

  

    const sendMessage=()=>{
        

        const newMessage:Message={
            id:Date.now(),
            message:chatInput,
            senderId:userId,
            receiverId:selectedUser.id,
            isSender:'user'
        }

       console.log("Message----------",newMessage);

     socket.emit("sendMessage",newMessage);
       setMessages([...messages,newMessage])
       setChatInput("");

    }
    return(
        <Card className="w-[350px] h-[500px] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 bg-green-500 text-white">
        <div className="flex items-center space-x-2 ">
          <Avatar className="h-8 w-8 text-center">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback>{selectedUser.name.split(" ").map(n=>n[0]).join('')}</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold">{selectedUser.name}</h2>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-green-600"
          
        >
          <X className="h-5 w-5"  onClick={closeChat}/>
        </Button>

         
      </CardHeader>
      <CardContent className="flex-grow overflow-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message?.isSender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-2 ${
                message?.isSender === 'user'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.message}
            </div>
          </div>
        ))}
      </CardContent>
      
        <CardFooter className="border-t p-4">
          <form onSubmit={(e)=>{
            e.preventDefault();
            sendMessage();
          }} className="flex w-full space-x-2">
            <Input
              type="text"
              placeholder="Type a message..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-grow"
            />

            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    )
}