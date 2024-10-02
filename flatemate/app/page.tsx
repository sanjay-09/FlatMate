"use client";
import Link from "next/link"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { signIn, signOut, useSession } from "next-auth/react";
import { CiFilter } from "react-icons/ci";
import { CiBoxList } from "react-icons/ci";
import { CiLocationOn } from "react-icons/ci";
import { FaPlusCircle } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { roomType } from "./global.types";
import Room from "@/components/Room"
import AddRoom from "@/components/AddRoom";
import { AppContext } from "./Context/AppContextProvider";

export default function Component() {
  const session=useSession();
  console.log("session",session);
  const ans=useContext(AppContext);
  console.log(ans);
  const [roomData,setRoomData]=useState<roomType[] | []>([]);

  useEffect(()=>{ 
    console.log("fetch");
    fetchData();


  },[ans?.refresh]);

  const fetchData=async()=>{
    
    const response=await fetch("/api/rooms/");
    if(!response.ok){
      return;

    }
    const data=await response.json();
    console.log("data",data);
    setRoomData(data.data);

  }
  return (
    <div className="flex flex-col min-h-screen">
   
      <main className="flex-1 bg-background">
        <div className="container mx-auto py-8 px-4 md:px-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                  <CiFilter />
                    <span>Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>Filter by:</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>Price</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Bedrooms</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Amenities</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                  <CiBoxList />
                    <span>Sort</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>Sort by:</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value="price">
                    <DropdownMenuRadioItem value="price">Price</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="bedrooms">Bedrooms</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="date">Date Listed</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
          <AddRoom/>
          
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {
            roomData.length>0 && roomData.map((room,idx)=>{
              return <Link href={`/room/${room._id}`}><Room room={room}/></Link>

            })

          }
          </div>
        </div>
      </main>
      <footer className="bg-muted text-muted-foreground py-4 px-4 md:px-6">
        <div className="container mx-auto flex items-center justify-between">
          <p className="text-sm">&copy; 2024 Flatmates. All rights reserved.</p>
          <nav className="flex items-center gap-4">
            <Link href="#" className="hover:underline" prefetch={false}>
              About
            </Link>
            <Link href="#" className="hover:underline" prefetch={false}>
              Contact
            </Link>
            <Link href="#" className="hover:underline" prefetch={false}>
              Privacy
            </Link>
            <Link href="#" className="hover:underline" prefetch={false}>
              Terms
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}







