import { PlayerEnum } from './shared/card';

export let hostURL = "http://localhost:8080/api/";
export let liveURL = "https://enigmatic-anchorage-18133.herokuapp.com/api/"

export const playerRouter = {
    [PlayerEnum.PLAYER]: '↓',
    [PlayerEnum.OPPONENT]: '↑',
    [PlayerEnum.BOTH]: '↕'
}

export const filterIfHas = <T>(arr: T[] | undefined, value:T): T[]=>{
    if(arr === undefined){
        return []
    }
    const indexOf = arr.indexOf(value);
    if(indexOf >= 0){
        return arr.filter((_,i)=> i !== indexOf); 
    }else{
        return arr; 
    }
}

let id = 0; 
export const getID = ()=>{
    return id++; 
}