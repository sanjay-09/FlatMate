"use client";
import { createContext, useState,Dispatch, SetStateAction } from "react";

type RefreshContextType={
    refresh:Boolean,
    setRefresh:Dispatch<SetStateAction<boolean>>;
}
export const AppContext=createContext<RefreshContextType | null>(null);



const AppContextProvider=({children}:{children:React.ReactNode})=>{
    const [refresh,setRefresh]=useState(false);

    return(
        <AppContext.Provider value={{refresh,setRefresh}}>
            {children}
        </AppContext.Provider>
    )

}
export default AppContextProvider;