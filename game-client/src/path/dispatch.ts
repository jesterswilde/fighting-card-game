import { ToPathStringAction, PathActionEnum, ToPathArrayActon, PopPathAction, AppendToPathAction } from "./actions";
import { store } from "../state/store";

export const dispatchPopPath = ()=>{
    const action: PopPathAction = {
        type: PathActionEnum.POP_PATH
    }
    store.dispatch(action); 
}

export const dispatchAppendPath = (toAppend: string | string[])=>{
    const action: AppendToPathAction = {
        type: PathActionEnum.APPEND_TO_PATH,
        toAppend
    }
    store.dispatch(action); 
}

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
/*

         Store
        {State}
        /     \
   Dispatch  Get State (returns state)
      |
  Reducers(action)


 */

window.onpopstate = (ev)=>{
    console.log("popping state"); 
    dispatchToPathString(location.pathname); 
}