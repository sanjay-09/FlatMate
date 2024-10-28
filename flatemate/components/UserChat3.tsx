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
import toast from "react-hot-toast"

export const UserChat3=({selectedUser,userId,closeChat}:{selectedUser:MessageEnhanced,userId:string,closeChat:()=>void})=>{

    console.log("userChat=====2");
    const [chatInput,setChatInput]=useState<string>("");
    const [messages,setMessages]=useState<Message[]>([]);
  

    const handleReceiveMessage = ({ senderId, message, ids }: { senderId: string, message: string, ids: string[] }) => {
    
      fetch("/api/chat/updateFlag", {
        method: "POST",
        body: JSON.stringify({ id: ids })
      });
  
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          message: message,
          senderId: senderId,
          isSender: 'other'
        }
      ]);
    };
  

    useEffect(()=>{
       
       
       
        socket.on("receiveMessage", handleReceiveMessage);
        fetchData();

        return ()=>{
          socket.off("receiveMessage",handleReceiveMessage);
        }

       
    },[]);
    
    
    const fetchData=async()=>{
     

        try{
          const start=Date.now();
          const [data1,data2]=await Promise.all([await fetch(`/api/chat/user?userId=${userId}&receiverId=${selectedUser.id}`),await fetch(`/api/chat/updateFlag/all?userId=${userId}&receiverId=${selectedUser.id}`)]);
          const end=Date.now();
        if(!data1.ok){
          toast.error("first time chatting with the user");
            return;

        }

        console.log("duration 2",end-start);
        const response=await data1.json();
        
        setMessages(response.messages);

        }
        catch(error){
          console.log("faileed");
        }
    }

  

    const sendMessage=()=>{
        

        const newMessage:Message={
            id:Date.now(),
            message:chatInput,
            senderId:userId,
            receiverId:selectedUser.id,
            isSender:'user'
        }

      

     socket.emit("sendMessage",newMessage);
       setMessages([...messages,newMessage])
       setChatInput("");

    }
    return(
        <Card className="w-[350px] h-[500px] sm:ml-0 ml-24 flex flex-col">
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