import { UserState } from "../user/interface";
import { foo } from "./store";

export const saveLogin = (user: UserState)=>{
    try{
        const stringified = JSON.stringify({user: user})
        localStorage.setItem("storeState", stringified)
    }catch(err){

    }
}

export const loadState = ()=>{
    try{
        const stringified = localStorage.getItem("storeState"); 
        if(stringified){
            return JSON.parse(stringified); 
        }else{
            return undefined; 
        }
    }catch(err){
        return undefined; 
    }
}