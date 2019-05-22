import { UpdateDeckObj } from "./interface";
import { store } from "../state/store";
import isEqual from 'lodash/isEqual'

export const getUpdateDeckObj = (): UpdateDeckObj=>{
    const deckObj: UpdateDeckObj = {};
    const {deckEditor:{deck, uneditedDeck}} = store.getState();
    if(!isEqual(deck.cards, uneditedDeck.cards)){
        deckObj.cards = deck.cards; 
    }
    if(!isEqual(deck.styles, uneditedDeck.styles)){
        deckObj.styles = deck.styles;
    }
    if(deck.name !== uneditedDeck.name){
        deckObj.name = deck.name; 
    }
    if(deck.description !== uneditedDeck.description){
        deckObj.description = deck.description; 
    }
    return deckObj; 
}