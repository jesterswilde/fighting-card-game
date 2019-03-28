import { store } from "../state/store";
import { FightingStyleEnum, GotFightingStyleAction, GotFightingStyleDescriptions } from "./actions";
import { HOST_URL } from "../util";
import { FightingStyle, FightingStyleDescription } from "./interface";


export const dispatchGetFightingStyleByName = async(styleName: string)=>{
    const style = await getFightingStyle(styleName); 
    const action: GotFightingStyleAction = {
        type: FightingStyleEnum.GOT_STYLE,
        style
    }
    store.dispatch(action); 
}

const getFightingStyle = async(styleName: string)=>{
    store.dispatch({type: FightingStyleEnum.LOADING_STYLE});
    const fetched = await fetch(HOST_URL + '/styles/' + styleName); 
    if(fetched.ok){
        const style: FightingStyle = await fetched.json(); 
        return style; 
    }
    return null; 
}

export const dispatchGetFightingStyles = async()=>{
    const styleDescriptions = await getFightingStyleDescriptions();
    const action: GotFightingStyleDescriptions = {
        type: FightingStyleEnum.GOT_STYLE_NAMES,
        styleDescriptions
    }
    store.dispatch(action); 
}

const getFightingStyleDescriptions = async()=>{
    store.dispatch({type: FightingStyleEnum.LOADING_STYLE_NAMES});
    const fetched = await fetch(HOST_URL + '/styles'); 
    if(fetched.ok){
        const styles: FightingStyleDescription[] = await fetched.json(); 
        return styles; 
    }
    return null; 
}