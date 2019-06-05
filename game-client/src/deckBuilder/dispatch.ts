import { HOST_URL, makeAuthHeader } from "../util";
import { GotDecksAction, DeckEditorEnum, ChoseDeckAction, CreateDeckAction, UpdateDeckAction, DeleteDeckAction, RevertDeckAction, ChangeDeckNameAction, ShowingUnusedStylesAction } from "./actions";
import { store } from "../state/store";
import { EditingDeck, UpdateDeckObj } from "./interface";
import { getUpdateDeckObj } from "./util";

export const dispatchCreateDeck = async () => {
    const deck = await createDeck();
    const action: CreateDeckAction = {
        type: DeckEditorEnum.CREATE_DECK,
        deck
    }
    store.dispatch(action);
    dispatchGetDecks(); 
}

const createDeck = async () => {
    const fetched = await fetch(HOST_URL + '/decks/new', {
        headers: makeAuthHeader(),
        method: 'POST'
    })
    if (fetched.ok) {
        const deck: EditingDeck = await fetched.json();
        return deck;
    }
}

export const dispatchUpdateDeck = async () => {
    const { updateDeckObj, id } = getUpdateDeckObj();
    const success = await updateDeck(id, updateDeckObj);
    if (success) {
        const action: UpdateDeckAction = {
            type: DeckEditorEnum.UPDATE_DECK
        }
        store.dispatch(action);
    }
}

const updateDeck = async (id: number, deck: UpdateDeckObj) => {
    const headers = makeAuthHeader(); 
    headers.append('Accept', 'application/json'); 
    headers.append('Content-Type', 'application/json'); 
    const fetched = await fetch(HOST_URL + '/decks/' + id, {
        method: "PUT",
        headers,
        body: JSON.stringify(deck)
    });
    if (fetched.ok) {
        return true;
    }
    return false;
}


export const dispatchGetDecks = async () => {
    const decks = await fetchDecks();
    const action: GotDecksAction = {
        type: DeckEditorEnum.GOT_DECKS,
        decks
    }
    store.dispatch(action);
}

const fetchDecks = async () => {
    const fetched = await fetch(HOST_URL + '/decks/', {
        headers: makeAuthHeader(),
        method: "GET",
    });
    if (fetched.ok) {
        const decks = await fetched.json();
        return decks;
    }
}

export const dispatchChoseDeck = async (deckID: number) => {
    const deck = await getDeckByID(deckID);
    const action: ChoseDeckAction = {
        type: DeckEditorEnum.CHOSE_DECK,
        deck
    }
    store.dispatch(action);
}

const getDeckByID = async (deckID: number) => {
    const fetched = await fetch(HOST_URL + '/decks/' + deckID, {
        headers: makeAuthHeader(),
        method: "GET",
    })
    if (fetched.ok) {
        const deck = await fetched.json();
        return deck;
    }
}

export const dispatchDeleteDeck = async (deckID: number) => {
    const success = await deleteDeck(deckID);
    if (success) {
        const action: DeleteDeckAction = {
            type: DeckEditorEnum.DELETE_DECK,
            id: deckID
        }
        store.dispatch(action);
    }
    dispatchGetDecks();
}

const deleteDeck = async (deckID: number) => {
    const fetched = await fetch(HOST_URL + '/decks/' + deckID, {
        method: "DELETE",
        headers: makeAuthHeader(),
    })
    if (fetched.ok) {
        return true;
    }
    return false;
}

export const dispatchRevertDeck = () => {
    const action: RevertDeckAction = {
        type: DeckEditorEnum.REVERT_DECK
    }
    store.dispatch(action);
}

export const dispatchChangeDeckName = (name: string)=>{
    const action: ChangeDeckNameAction = {
        type: DeckEditorEnum.CHANGE_NAME,
        name
    };
    store.dispatch(action); 
}

export const dispatchShowingUnusedStyles = (showing: boolean)=>{
    const action: ShowingUnusedStylesAction = {
        type: DeckEditorEnum.SHOWING_UNUSED_STYLES,
        showing
    }
    store.dispatch(action);
}