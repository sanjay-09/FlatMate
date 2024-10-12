import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageSquare, Send, X } from 'lucide-react'
import { user } from '@/app/global.types'
import { useSession } from 'next-auth/react'
import { UserChat3 } from './UserChat3'
import { socket } from '@/app/Client/socket'

export interface MessageEnhanced {
  id: string;
  name: string;
  avatar: string;
  message?: string;
  date?: string;
  count?:Number
}



export default function EnhancedMessageInbox({session}:{session:any}) {
  console.log("Enhanced");
  const [isOpen, setIsOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<MessageEnhanced | null>(null)
  const [chatInput, setChatInput] = useState('')
  const [messages,setMessages]=useState<MessageEnhanced[]>([]);



  useEffect(()=>{
    socket.emit("join",session.user.id);
    fetchData();
    socket.on("rcu",()=>{
      console.log("rcu");
      fetchData();

    });

  },[]);

  const fetchData=async()=>{
    console.log("session2",session);
    const data=await fetch(`api/chat?userId=${session.user.id}`);
    if(!data.ok){
       return;
     
    }
    const response=await data.json();
    if(response.length>0){
      console.log("resp",response.usersData);
       

     const newMessage=response.usersData.map((obj:{receiverUserData:user,message:string,updatedAt:string,count:Number})=>{
      const {receiverUserData,message,updatedAt,count}=obj;
      const isoString =updatedAt ;
      const dateOnly = isoString.split("T")[0];
        return {
          id:receiverUserData._id,
          name:receiverUserData.name,
          avatar:'http://placeholder.svg/?height=40&width=40',
          message,
          date:dateOnly,
          count
  
        }

      })
      setMessages(newMessage);


     
    

    }
  }

  const toggleInbox = () => setIsOpen(!isOpen)

  const openChat = (user: MessageEnhanced,i:number) => {
    setSelectedUser(user);
    const newMessages=[...messages];
    newMessages[i].count=0;
    setMessages(newMessages)


   
    
  }

  const closeChat = () => {
    setSelectedUser(null)
  }

 

  return (
    <div className="fixed bottom-4 right-4 flex items-end space-x-4">
      <div className="flex space-x-4">
        {selectedUser && (
          <UserChat3 selectedUser={selectedUser} userId={session.user.id} closeChat={closeChat}/>
        )}
        {isOpen && (
          <Card className="w-80 h-[500px] flex flex-col">
            <CardHeader className="bg-gray-100 px-4 py-3 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
            </CardHeader>
            <ScrollArea className="flex-grow">
              <CardContent className="divide-y p-0">
                {messages.map((message,i) => (
                  <div
                    key={message.id}
                    className="flex items-center space-x-2 px-2 py-3 hover:bg-gray-50 transition-colors duration-150 ease-in-out cursor-pointer"
                    onClick={() => openChat(message,i)}
                  >
                    <Avatar className="flex-shrink-0 w-8 h-8">
                      <AvatarImage src={message.avatar} alt={message.name} />
                      <AvatarFallback>{message.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow min-w-0 space-y-1">
                      <div className="flex justify-between items-baseline">
                        <p className="text-sm font-medium text-gray-900 truncate">{message.name}</p>
                        <span className="text-xs text-gray-400 flex-shrink-0">{message.date}</span>
                      </div>
                     {//@ts-ignore
                      <p className="text-sm text-gray-500 truncate">{message.message} {!selectedUser && message?.count!>0  && <span className='absolute rounded-md right-2 border bg-green-500 px-2 text-white '>{message.count!}</span>}</p>
                     }
                    </div>
                  </div>
                ))}
              </CardContent>
            </ScrollArea>
          </Card>
        )}
      </div>
      <Button
        onClick={toggleInbox}
        className="rounded-full w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    </div>
  )
}