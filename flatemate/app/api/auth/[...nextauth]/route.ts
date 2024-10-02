import user from "@/db/Model/user"
import { connect } from "@/db"
import NextAuth, {type DefaultSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
declare module "next-auth" {
    interface Session {
        user: {
            id: string
        } & DefaultSession["user"]
    }
  }

const handler=NextAuth({
    providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID ?? "",
          clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
      
      ],
    callbacks:{
        async signIn(params){
            if(!params.user.email){
                return false;

            }
            await connect();
            const isUserPresent=await user.findOne({
                email:params.user.email ?? ""
            })
            if(isUserPresent){
                return true;
            }
            //creating the user
            await user.create({
                email:params.user.email,
                name:params.user.name

            })
            return true;

        },
        async session({session}){
            await connect();
           const dbUser=await user.findOne({
            email:session.user?.email
           })
           if(!dbUser){
            return session;
           }
           session.user.id=dbUser.id;
           return session;
            

        }
    }

})
export {handler as GET, handler as POST}