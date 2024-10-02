import { roomType } from "../global.types";

export const getInputType = (field: string): string => {
    if (field === "price" || field === "contact" || field === "size") return "number";
    return "text"; // Default to text for other fields
  };

  export const initialRoomState: roomType = {

    location: "",
    contact: 0,
    images: [],
    price: 0,
    preferance: "",
    amenities: [],
    size: 0,
    description: "",
};
