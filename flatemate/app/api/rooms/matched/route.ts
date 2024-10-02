import match from "@/db/Model/MatchedRoom";
import user from "@/db/Model/user";

import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server";
import { transporter } from "@/app/Client/Mailer";

export const POST=async(req:NextRequest)=>{
    const session=await getServerSession();
    const data=await req.json();
    // const isUser=await user.findOne({
    //     email:session?.user.email
    // });
    // if(!isUser){
    //     return NextResponse.json({
    //         message:'User is not authenticatd'
    //     },{
    //         status:500
    //     })
    // }
   try{
    await match.create({
        renterId:data.renterId,
        takerId:data.takerId,
        roomId:data.roomId
    })
    const renterDetails=await user.findById(data.renterId)
    const takerDetails=await user.findById(data.takerId);
    console.log("renter",renterDetails);

    const mailOptionsForRenter = {
      from:process.env.NEXT_EMAIL_ID,
        to:renterDetails.email,                      // Recipient's email
        subject:`SomeBody Is Interested in your property`,                 // Subject of the email
        html: `<h1>Welcome to FlatMate</h1>
               <p>Hi there,</p>
               <p>Somebody is  interested on your property,If you want to approve the request please login to the flatmate.:</p>
               <p>Thank you,</p>
               <p><strong>Your Team</strong></p>`, // HTML body content
      };

      const mailOptionsForTaker = {
        
        
        from:process.env.NEXT_EMAIL_ID,
        to:takerDetails.email,                      // Recipient's email
        subject:"YOur request has been raised successfully",                 // Subject of the email
        html: `<h1>Welcome to Our Service</h1>
               <p>Hi there,</p>
               <p>We have submited the request for the approval,when yours request will be approved you will get the details of the owner :</p>
               <p>Thank you,</p>
               <p><strong>Your Team</strong></p>`, // HTML body content
      };
      await Promise.all([await transporter.sendMail(mailOptionsForRenter),await transporter.sendMail(mailOptionsForTaker)])

    
    return NextResponse.json({

        message:'match request is created'
    },{
        status:200
    })
   }
   catch(err){
    console.log("err",err);
    return NextResponse.json({
        message:'match request cannot be created'
    },{
        status:500
    })
   }
    

}