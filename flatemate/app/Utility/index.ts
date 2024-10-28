import { roomType } from "../global.types";
import * as Z from "zod";

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
export const roomSchema=Z.object({
  contact:Z
  .number()
  .refine((val) =>val === undefined || val.toString().length === 10, {
    message: "Enter the correct contact number",
  }),
  price:Z.number().max(25000,"price cannot be more than 25000"),
  size:Z.number().max(5,"Size cannot be more than 5"),
  images:Z.number().min(1,"Upload Atleast one image")

})

export const items=["location","contact","price","description","size"]


type renderPhase={
  id:string,
  phase:string,
  actualDuration:string
}

export function onRenderCallback( 
  id: string, // The id prop of the Profiler tree that has just committed
  phase: "mount" | "update", // Mount (initial render) or Update (re-render)
  actualDuration: number, // Time spent rendering the committed update
  baseDuration: number, // Estimate of time to render the entire subtree
  startTime: number, // When React began rendering this update
  commitTime: number, // When React committed this update
  interactions: Set<any> // Set of interactions for the render
  ) {
  console.log(`Component: ${id}, Render phase: ${phase}, Render time: ${actualDuration} ms`);
}