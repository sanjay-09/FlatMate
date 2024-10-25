import { Button } from "./ui/button";
import { CiCirclePlus } from "react-icons/ci";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Input } from "./ui/input";
import { useContext, useEffect, useState } from "react";
import { roomType } from "@/app/global.types";
import { supabase } from "@/app/Client/supabase";
import { useRouter } from "next/navigation";
import { AppContext } from "@/app/Context/AppContextProvider";
import { getInputType, initialRoomState } from "@/app/Utility";
import ClipLoader from "react-spinners/ClipLoader";
import toast from 'react-hot-toast';
import { useSession } from "next-auth/react";
import * as Z from "zod";
import { roomSchema } from "@/app/Utility";
import { items } from "@/app/Utility";

const AddRoom=()=>{
    //varaible
    const router=useRouter();
    const ans=useContext(AppContext);
    const [loading,setLoading]=useState(false);
    const session=useSession();
    const [errors,setErrors]=useState<{[key:string]:string}>({})

    //state variables
    const [open,setOpen]=useState(false);
    const [amenities,setAmenties]=useState([
        {
            option:'AC/Cooler',checked:false
        },{
            option:'kitchen',checked:false
        },{
            option:'balcony',checked:false
        }
    ]);
    const [room,setRoom]=useState<roomType>(initialRoomState);


    //handleInputFunctiaon
    const handleChange=async(e:any)=>{
        const {name,value,type}=e.target;
        setRoom({
            ...room,
            [name]:type==='number'?Number(value):value
        });
       
        
    }
    

    //files are saved to supabase 
    const handleFilesChange=async(e:any)=>{
        console.log("")
        //@ts-ignore
        const uploadedImageUrls=[];
      
        const selectedFiles=Array.from(e.target.files);
        setLoading(true);
        await Promise.all(
            selectedFiles.map(async(file:any)=>{
                //@ts-ignore
                const fileName=`${Date.now()}_${file.name}`;
                const {data,error}=await supabase.storage.from('FlatMate').upload(fileName,file);
                if(error){
                    throw error;
                }

                const { data:d, error:e } = await supabase.storage
                .from('FlatMate')
                .createSignedUrl(fileName, 100 * 365 * 24 * 60 * 60)
              

                uploadedImageUrls.push(d?.signedUrl);

                
            })
        )
        const newRoom={...room};
        //@ts-ignore
        newRoom.images=uploadedImageUrls;
       setRoom(newRoom);
       setLoading(false);
      
        
      }
    

    //checkbox
    const handleCheckbox=(idx:number)=>{
        const newData=[...amenities];
        newData[idx].checked=!newData[idx].checked;
        setAmenties(newData);
     }
   

    //Submit 
    const handleSubmit=async()=>{
        const result=await roomSchema.safeParse({contact:room.contact,price:room.price,size:room.size,images:room.images.length})
        if(!result.success){
            const err=result.error.errors;
            console.log("errors",err);
            const obj: { [key: string]: string }={};
            err.map((e,i)=>{
                obj[`${e.path[0]}`] = e.message;

            })
            setErrors(obj);
            toast.error("Please fill the correct detail in order to submit");
            return;
           
        }
        setLoading(true);
      const newRoom={...room};
      for(let i=0;i<=amenities.length-1;i++){
        if(amenities[i].checked){
            newRoom.amenities.push(amenities[i].option);
        }
      }
      newRoom.userId=session.data?.user.id ?? "";
      setRoom(newRoom);
      const data=await fetch("/api/rooms",{
        method:"POST",
        body:JSON.stringify(newRoom)
      })
      if(data.ok){
        toast.success("successfully added the room");
        setOpen(!open);
        ans?.setRefresh(!ans.refresh);
        setLoading(false)
        setRoom(initialRoomState);
        setErrors({})
    

        
      }



      }



  //This useEffect is used only to empty the values when the dialog box closes
    useEffect(()=>{
        if(!open){
            setErrors({});
            setRoom(initialRoomState);
        }

    },[open])
     
    return(
        <div>
         <Dialog open={open} onOpenChange={setOpen}  >
  <DialogTrigger onClick={()=>setOpen(!open)} className="border border-black bg-grey p-2 text-black rounded-md text-sm">Add Rooms</DialogTrigger>
  <DialogContent>
    <DialogHeader>
     {
        items.map((item,idx)=>{
            return (
                <>
                 <DialogTitle className="text-sm">{item.toUpperCase()}</DialogTitle>
      <DialogDescription>
       { errors[item] && <span className="text-red-300">*{errors[item]}</span>}
        <Input    type={getInputType(item)} name={item}    value={room[item as keyof roomType]?.toString() || ""} onChange={handleChange}/>
      </DialogDescription>
                </>
            )
        })
     }
     
    </DialogHeader>
    <DialogHeader>
    <DialogTitle className="text-sm">PREFERENCE</DialogTitle>
      <DialogDescription className="flex items-center gap-4">
   <label className="items-center"><input className="text-black" type="radio" name="preferance" value="Female" onChange={handleChange} />Female</label>
   <label  className="items-center" ><input className="text-black" type="radio" name="preferance" value="male" onChange={handleChange} />Male</label>
     
      </DialogDescription>
        
    </DialogHeader>
    <DialogHeader>
        <DialogTitle className="text-sm">
            AMENTIES
        </DialogTitle>
        <DialogDescription>
            {
                amenities.map((obj,idx)=>{
                    return (
                     <div>
                        <label htmlFor="" className=" flex items-center gap-2">   <input type="checkbox" checked={obj.checked} value={obj.option} onClick={()=>{handleCheckbox(idx)}}/>
                        <h1>{obj.option}</h1>
                        </label>
                      
                     </div>
                    )
                })
            }
        </DialogDescription>
    </DialogHeader>

    <DialogHeader>
        {errors.images && <span className="text-red-300">{errors.images}</span>}
        <DialogTitle className="text-sm">
           ADD IMAGES(*Multiple images can be selected also)
           
        </DialogTitle>

        <DialogDescription>
        <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFilesChange}
        className="file-input"
      />
        </DialogDescription>
    </DialogHeader>

    <DialogHeader>
        <DialogTitle className="flex flex-row-reverse">
           {
            loading?<ClipLoader color="#FFFF00"  size={20}/>: <button onClick={handleSubmit} className="bg-black text-white p-2 rounded-sm">Submit</button>
           }
        </DialogTitle>
    </DialogHeader>

    
  </DialogContent>
  
</Dialog>



        </div>

    )
}
export default AddRoom;