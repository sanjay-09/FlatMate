import { useEffect, useState } from 'react'
import { Send, X, MessageSquare } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {socket} from "@/app/Client/socket"
export interface Message {
  
  id: number;
  message: string;
  senderId?: string;
  receiverId?:string | Boolean,
  isSender?:'user' | 'other'
}

export default function UserChat({userId,receiverId,ChatOpen}:{userId:string | undefined,receiverId:string | Boolean,ChatOpen:Boolean}) {
  // console.log("userChat",userId,receiverId);
  // const [receiver,setReceiver]=useState<string|Boolean>(receiverId);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(ChatOpen);
   

  useEffect(()=>{

   
    console.log("userIDDD------------------->",userId);
    socket.emit("join",userId);

  
    socket.on("receiveMessage",({senderId,message})=>{
   
     
      setMessages((prev)=>{
        return [...prev,{
          id:Date.now(),
          message:message,
          senderId:senderId,
          isSender:'other'
        }]
      })

    })

  },[]);

  const sendMessage = (sender: 'user' | 'other') => {
    if (inputMessage.trim() !== '') {
      const newMessage: Message = {
        id: Date.now(),
        message: inputMessage,
        senderId:userId,
        receiverId,
        isSender:'user'
      };
      console.log("mssss",newMessage);
      socket.emit("sendMessage",newMessage);
      console.log("message",newMessage)
      setMessages([...messages, newMessage]);
      setInputMessage('');
    }
  };

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  if (!isChatOpen) {
    return (
      <Button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 bg-green-500 text-white hover:bg-green-600"
      >
        <MessageSquare className="h-5 w-5 mr-2" />
        Open Chat
      </Button>
    );
  }

  return (
    <Card className="w-[350px] h-[500px] fixed bottom-4 right-4 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 bg-green-500 text-white">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback>UC</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold">Chat</h2>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-green-600"
          onClick={toggleChat}
        >
          <X className="h-5 w-5" />
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
      <CardFooter className="p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage('user');
          }}
          className="flex w-full items-center space-x-2"
        >
          <Input
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" size="icon" className="bg-green-500 text-white hover:bg-green-600">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}