import { StoreState } from "./state/store";
import {connect} from 'preact-redux'; 
import {Component} from 'preact'; 


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