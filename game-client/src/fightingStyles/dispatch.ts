import { store } from "../state/store";
import { FightingStyleEnum, GotFightingStyleAction, GotFightingStyleDescriptions, ViewingFromDeckEditAction } from "./actions";
import { HOST_URL } from "../util";
import { FightingStyle, FightingStyleDescription } from "./interface";
import { dispatchToPathArray } from "../path/dispatch";

export const dispatchViewStyleFromDeck = (styleName: string)=>{
    dispatchToPathArray(['styles', styleName])
    viewingFromDeckEdit(true); 
}

export const dispatchFromStyleToDeckEdit = ()=>{
    const deckID = store.getState().deckEditor.deck.id; 
    dispatchToPathArray(['builder', deckID.toString()]);
    viewingFromDeckEdit(false)
}

const viewingFromDeckEdit = (isEditingDeck: boolean)=>{
    const action: ViewingFromDeckEditAction = {
        type: FightingStyleEnum.VIEWING_FROM_DECK_EDIT,
        isEditingDeck
    }
    store.dispatch(action); 
}

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

export const getFightingStyles = async()=>{
    //If you already have the styles, don't re-fetch them
    const currentStyles = store.getState().fightingStyle.styleDescriptions 
    if(currentStyles && currentStyles.length > 0){
        return; 
    }
    store.dispatch({type: FightingStyleEnum.LOADING_STYLE_NAMES});
    const styleDescriptions = await getFightingStyleDescriptions();
    const action: GotFightingStyleDescriptions = {
        type: FightingStyleEnum.GOT_STYLE_NAMES,
        styleDescriptions
    }
    store.dispatch(action); 
}

const getFightingStyleDescriptions = async()=>{
    const fetched = await fetch(HOST_URL + '/styles'); 
    if(fetched.ok){
        const styles: FightingStyleDescription[] = await fetched.json(); 
        return styles; 
    }
    return null; 
}