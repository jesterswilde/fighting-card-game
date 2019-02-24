import { ToPathStringAction, PathActionEnum, ToPathArrayActon } from "./actions";
import { store } from "../state/store";

export const dispatchToPathString = (path: string)=>{
    const action: ToPathStringAction = {
        type: PathActionEnum.TO_PATH_STRING,
        path
    }
    store.dispatch(action); 
}

export const dispatchToPathArray = (path: string[])=>{
    const action: ToPathArrayActon = {
        type: PathActionEnum.TO_PATH_ARRAY,
        path
    }
    store.dispatch(action); 
}

window.onpopstate = (ev)=>{
    console.log("popping state"); 
    dispatchToPathString(location.pathname); 
}