import { AddCardAction, DeckEditorEnum, RemoveCardAction, AddStyleAction, RemoveStyleAction, GotPossibleCardsAction } from "./actions";
import { store } from "../state/store";
import { HOST_URL } from "../util";

const dispatchDEAddCard = (card: string)=>{
    const action: AddCardAction = {
        type: DeckEditorEnum.ADD_CARD,
        card
    }
    store.dispatch(action); 
}

const dispatchDERemoveCard = (card: string)=>{
    const action: RemoveCardAction = {
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
    const action: AddStyleAction = {
        type: DeckEditorEnum.ADD_STYLE,
        style
    }
    store.dispatch(action); 
}

export const dispatchDERemoveStyle = (style: string)=>{
    const action: RemoveStyleAction = {
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
    getPossibleCards(); 
}

const getPossibleCards = async()=>{
    const styles = store.getState().deckEditor.deck.styles; 
    const fetched = await fetch(HOST_URL + '/decks/possibleCards?styles=' + styles.join(','), {
        method: "GET",
    });
    if (fetched.ok) {
        const possibleCards = await fetched.json(); 
        const action: GotPossibleCardsAction = {
            type: DeckEditorEnum.GOT_POSSIBLE_CARDS,
            possibleCards
        }
        store.dispatch(action); 
    }
}