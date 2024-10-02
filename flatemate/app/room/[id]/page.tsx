"use client"

import { useState,useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Wifi, Tv, Coffee, Utensils, IndianRupee, Ruler, Users, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"
import { roomType } from "@/app/global.types"
import { Badge } from "@/components/ui/badge"
import room from "@/db/Model/room"
import { useSession } from "next-auth/react"
import toast from 'react-hot-toast';



export default function Component({params}:{params:{id:string}}) {

  const session=useSession();
  console.log("session",session.data?.user.id);
  

   const [roomData,setRoomData]=useState<roomType>();
    useEffect(()=>{
        fetchData();

    },[params.id]);
    const fetchData=async()=>{
        const data=await fetch(`/api/rooms/roomId?id=${params.id}`);
        if(!data.ok){
            return;
        }

        const response=await data.json();
        console.log("response",response);
        setRoomData(response.data);
       


    }
    console.log('roomUserId',roomData?.userId);
  const [currentImage, setCurrentImage] = useState(0)

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % roomData?.images.length!)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + roomData?.images.length!) % roomData?.images.length!)
  }
  

  const handleClick=async()=>{
    const payload={
      renterId:typeof roomData?.userId === 'object' && roomData?.userId._id,
      takerId:session?.data?.user.id,
      roomId:roomData?._id,
        
    }
    console.log("payload",payload);
    const data=await fetch("/api/rooms/matched",{
      method:"POST",
      body:JSON.stringify(payload)

    });
    if(data.ok){
      toast.success("Request for booking has been raised successfully")
      

    }
    
  }
 
  return (
    <div className="w-full md:w-2/4 mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Luxury Suite</CardTitle>
          <CardDescription>{roomData?.location}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <IndianRupee className="mr-2 h-4 w-4" />
              <span className="font-semibold">Price:</span>
              <span className="ml-2">{roomData?.price}</span>
            </div>
            <div className="flex items-center">
              <Ruler className="mr-2 h-4 w-4" />
              <span className="font-semibold">Size:</span>
              <span className="ml-2">{roomData?.size}</span>
            </div>
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              <span className="font-semibold">Preference:</span>
              <Badge variant="secondary" className="ml-2">{roomData?.preferance}</Badge>
            </div>
            <div className="flex items-center">
              <span className="font-semibold">Owner:</span>
              <span className="ml-2">{typeof roomData?.userId === 'object' && roomData?.userId.name}</span>
            </div>
          </div>

          <div className="relative aspect-video">
            <Image
              src={roomData?.images[currentImage]!}
              alt={`Room image ${currentImage + 1}`}
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Description</h3>
            <p className="text-sm text-muted-foreground">
             {roomData?.description}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Amenities</h3>
            <ul className="grid grid-cols-2 gap-2 text-sm">
             
             {
                roomData?.amenities.map((item,idx)=>{
                    return   <li className="flex items-center"> {item}</li>


                })
             }
             
            </ul>
          </div>

          {
            session.data?.user.id!==(typeof roomData?.userId === 'object' && roomData.userId._id) && <Button className="w-full" onClick={handleClick}>Book Now</Button>
          }
        </CardContent>
      </Card>
    </div>
  )
}