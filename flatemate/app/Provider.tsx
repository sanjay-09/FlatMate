"use client";
import Header from "@/components/Header";
import { SessionProvider } from "next-auth/react";
import React,{Profiler} from "react";
const Provider=({children}:{children:React.ReactNode})=>{

    return (
        <SessionProvider>
            <Header/>
            
            {children}
        </SessionProvider>
    )

}
export default Provider;