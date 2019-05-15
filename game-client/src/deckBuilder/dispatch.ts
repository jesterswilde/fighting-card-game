import { HOST_URL, makeAuthHeader } from "../util";
import { DEGotDecksAction, DeckEditorEnum, DEChoseDeckAction, DEAddCardAction, DERemoveCardAction, DEAddStyleAction, DERemoveStyleAction, DECreateDeckAction } from "./actions";
import { store } from "../state/store";
import { EditingDeck } from "./interfaces";

export const dispatchDECreateDeck = async()=>{
    const deck = await createDeck(); 
    const action: DECreateDeckAction = {
        type: DeckEditorEnum.CREATE_DECK,
        deck
    }
    store.dispatch(action): 
}

const createDeck = async()=>{
    const fetched = await fetch(HOST_URL + '/decks/new', {
        headers: makeAuthHeader(),
        method: 'POST'
    })
    if(fetched.ok){
        const deck: EditingDeck = await fetched.json();
        return deck; 
    }
}

export const updateDeck = async(deck: EditingDeck)=>{
    
}

export const dispatchDEGotDecks = async()=>{
    const decks = await fetchDecks(); 
    const action: DEGotDecksAction = {
        type: DeckEditorEnum.GOT_DECKS,
        decks
    }
    store.dispatch(action); 
}

const fetchDecks = async()=>{
    const fetched = await fetch(HOST_URL + '/user/decks',{
        headers: makeAuthHeader(),
        method: "GET",
    });
    if(fetched.ok){
        const decks = await fetched.json(); 
        return decks; 
    }
}

export const dispatchDEChoseDeck = async(deckID: number)=>{
    const deck = await getDeckByID(deckID); 
    const action: DEChoseDeckAction = {
        type: DeckEditorEnum.CHOSE_DECK,
        deck
    }
    store.dispatch(action); 
}

const getDeckByID = async(deckID: number)=>{
    const fetched = await fetch(HOST_URL + '/user/decks/' + deckID, {
        headers: makeAuthHeader(),
        method: "GET",
    })
    if(fetched.ok){
        const deck = await fetched.json(); 
        return deck; 
    }
}
