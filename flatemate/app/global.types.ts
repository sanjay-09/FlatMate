export type user={
    _id:string,
    name:string,
    email:string,

}
export type roomType={
    _id?:string,
    location:string,
    contact:number,
    images:string[],
    price:number,
    preferance:string,
    amenities:string[],
    size:number
    description:string,
    isavail?:Boolean,
    isapproved?:Boolean,
    userId?:user | string

}