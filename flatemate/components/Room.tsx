import { CiLocationOn } from "react-icons/ci";
import { Card, CardContent } from "./ui/card";
import { roomType } from "@/app/global.types";

const Room=({room}:{room:roomType})=>{
    return(
        <div>
            <Card className="h-[400px]">
              <img
                src={room?.images[0]}
                width={400}
                height={250}
                alt="Room Image"
                className="rounded-t-lg object-cover w-full aspect-[4/3]"
              />
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-lg font-semibold">{room?.description}</div>
                  <div className="text-primary font-semibold">{room?.price}/month</div>
                </div>
                <div className="text-muted-foreground text-sm mb-4">{room.size} Bedroom· 800 sq ft</div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <CiLocationOn />
                  <span>{room?.location}</span>
                </div>
              </CardContent>
            </Card>

        </div>
    )
}
export default Room;