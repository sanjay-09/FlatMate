import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import conversation from "./db/Model/Conversation.js";
import { connect } from "./db/index.js";
import messagedb from "./db/Model/Message.js"

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const users={};

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("user connected",socket.id);

    socket.on("join",(userId)=>{
      users[userId]=socket.id
      console.log(`User ${userId} connected with socket ID: ${socket.id}`);
    });
    socket.on("sendMessage",async({ id,message,senderId,receiverId})=>{
      await connect();

      if(!senderId ||!receiverId){
        console.log("id not present");
        return;
      }
      let conversationPresent=await conversation.findOne({
        participants:{
          $all:[senderId,receiverId]
          
        }
      })
      if(!conversationPresent){
       conversationPresent= await conversation.create({
          participants:[senderId,receiverId],
          lastMessage:message,
        })
      }
      
    const newMessage=await messagedb.create({
      conversationId:conversationPresent._id,
      senderId,
      message

    })
    console.log("newMessage",newMessage);
    conversationPresent.lastMessage=message;
    conversationPresent.updatedAt=new Date();
    await conversationPresent.save();

    
      
      receiverId=users[receiverId];
      console.log("---instance",users);
      if(receiverId){
      
        io.to(receiverId).emit("receiveMessage",{senderId,message});
      }
    })
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});