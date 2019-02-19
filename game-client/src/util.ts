import { StoreState } from "./state/store";
import {connect} from 'preact-redux'; 

export let HOST_URL = '/api'; 
if(location.host.split(':')[0] === 'localhost'){
    HOST_URL = 'http://localhost:8080/api'
}

export const cleanConnect = <T>(selector: (state: StoreState)=>T, comp: (props: T)=> JSX.Element)=>{
    return connect(selector)(comp) as unknown as ()=> JSX.Element; 
}

let uuid = 0; 
export const getUUID = (obj: {[index: string]: any})=>{
    if(obj.uuid === undefined){
        obj.uuid = uuid; 
        uuid++; 
    }
    return obj.uuid; 
}