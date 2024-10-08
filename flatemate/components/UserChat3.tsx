import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { X, Send } from "lucide-react"
import { Input } from "postcss"
import { Button } from "./ui/button"
import { Card, CardHeader, CardFooter } from "./ui/card"
import { Message } from "./UserChat2"

export const UserChat3=({selectedUser}:{selectedUser:Message})=>{
    return(
        <Card className="w-80 h-[500px] flex flex-col">
        <CardHeader className="bg-gray-100 px-4 py-3 border-b flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
              <AvatarFallback>{selectedUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <h3 className="text-lg font-semibold text-gray-800">{selectedUser.name}</h3>
          </div>
          <Button variant="ghost" size="icon">
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
    )
}