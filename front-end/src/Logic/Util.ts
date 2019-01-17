import { PlayerEnum } from './CardInterface';

export let hostURL = "http://localhost:8080/";

export const playerRouter = {
    [PlayerEnum.PLAYER]: '↓',
    [PlayerEnum.OPPONENT]: '↑',
    [PlayerEnum.BOTH]: '↕'
}

let uuid = 0; 
export const getUUID = (obj: {[index: string]: any})=>{
    if(obj.uuid === undefined){
        obj.uuid = uuid; 
        uuid++; 
    }
    return obj.uuid; 
}