import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageSquare, Send, X } from 'lucide-react'
import { user } from '@/app/global.types'

export interface Message {
  id: string;
  name: string;
  avatar: string;
  message: string;
  date: string;
}



export default function EnhancedMessageInbox({session}:{session:any}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<Message | null>(null)
  const [chatInput, setChatInput] = useState('')
  const [messages,setMessages]=useState<Message[]>([]);


  useEffect(()=>{
    fetchData();

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
       

     const newMessage=response.usersData.map((obj:{receiverUserData:user,message:string,updatedAt:string})=>{
      const {receiverUserData,message,updatedAt}=obj;
      const isoString =updatedAt ;
      const dateOnly = isoString.split("T")[0];
        return {
          id:receiverUserData._id,
          name:receiverUserData.name,
          avatar:'http://placeholder.svg/?height=40&width=40',
          message,
          date:dateOnly
  
        }

      })
      setMessages(newMessage);
   
      console.log("newMessage",newMessage);


     
    

    }
  }

  const toggleInbox = () => setIsOpen(!isOpen)

  const openChat = (user: Message) => {
    setSelectedUser(user)
  }

  const closeChat = () => {
    setSelectedUser(null)
  }

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (chatInput.trim()) {
      console.log(`Sending message to ${selectedUser?.name}: ${chatInput}`)
      setChatInput('')
    }
  }

  return (
    <div className="fixed bottom-4 right-4 flex items-end space-x-4">
      <div className="flex space-x-4">
        {selectedUser && (
          <Card className="w-80 h-[500px] flex flex-col">
            <CardHeader className="bg-gray-100 px-4 py-3 border-b flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                  <AvatarFallback>{selectedUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold text-gray-800">{selectedUser.name}</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={closeChat}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <ScrollArea className="flex-grow p-4">
              <div className="space-y-4">
                <div className="bg-gray-100 p-2 rounded-lg max-w-[80%]">
                  <p className="text-sm">{selectedUser.message}</p>
                </div>
              </div>
            </ScrollArea>
            <CardFooter className="border-t p-4">
              <form onSubmit={sendMessage} className="flex w-full space-x-2">
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
        )}
        {isOpen && (
          <Card className="w-80 h-[500px] flex flex-col">
            <CardHeader className="bg-gray-100 px-4 py-3 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
            </CardHeader>
            <ScrollArea className="flex-grow">
              <CardContent className="divide-y p-0">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="flex items-center space-x-2 px-2 py-3 hover:bg-gray-50 transition-colors duration-150 ease-in-out cursor-pointer"
                    onClick={() => openChat(message)}
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
                      <p className="text-sm text-gray-500 truncate">{message.message}</p>
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