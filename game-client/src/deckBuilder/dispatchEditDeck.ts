import { DEAddCardAction, DeckEditorEnum, DERemoveCardAction, DEAddStyleAction, DERemoveStyleAction } from "./actions";
import { store } from "../state/store";

const dispatchDEAddCard = (card: string)=>{
    const action: DEAddCardAction = {
        type: DeckEditorEnum.ADD_CARD,
        card
    }
    store.dispatch(action); 
}

const dispatchDERemoveCard = (card: string)=>{
    const action: DERemoveCardAction = {
        type: DeckEditorEnum.REMOVE_CARD,
        card
    }
    store.dispatch(action); 
}

export const dispatchDEToggleCard = (card: string, hasCard: boolean)=>{
    if(hasCard){
        dispatchDEAddCard(card); 
    }else{
        dispatchDERemoveCard(card); 
    }
}


export const dispatchDEAddStyle = (style: string)=>{
    const action: DEAddStyleAction = {
        type: DeckEditorEnum.ADD_STYLE,
        style
    }
    store.dispatch(action); 
}

export const dispatchDERemoveStyle = (style: string)=>{
    const action: DERemoveStyleAction = {
        type: DeckEditorEnum.REMOVE_STYLE,
        style
    }
    store.dispatch(action); 
}

export const dispatchDEToggleStyle = (style: string, addStyle: boolean)=>{
    if(addStyle){
        dispatchDEAddStyle(style); 
    }else{
        dispatchDERemoveStyle(style); 
    }
}