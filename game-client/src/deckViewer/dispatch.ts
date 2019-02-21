import { GotDeckActioin, DeckViewerEnum, FailedToGetDeckAction, GotDeckListAction, LoadingDeckAction, UpdateDVFilterAction, AddDVFilterAction, RemoveDVFilterAction } from './actions';
import { store } from '../state/store';
import { Deck, DeckViewerFilter } from './interface';
import { HOST_URL } from '../util';

export const dispatchUpdateDVFilter = (filter: DeckViewerFilter, index: number)=>{
    const action: UpdateDVFilterAction = {
        type: DeckViewerEnum.UPDATED_FILTER,
        filter,
        index
    }
    store.dispatch(action); 
}

export const dispatchAddDVFilter = ()=>{
    const action: AddDVFilterAction = {
        type: DeckViewerEnum.ADDED_FILTER
    }
    store.dispatch(action); 
}

export const dispatchRemoveDVFilter = (index: number)=>{
    const action: RemoveDVFilterAction = {
        type: DeckViewerEnum.REMOVED_FILTER,
        index
    }
    store.dispatch(action); 
}

export const dispatchGetDeckWithName = async (deckName: string) => {
    const deck = await getDeckWithName(deckName);
    if (deck) {
        const action: GotDeckActioin = {
            type: DeckViewerEnum.GOT_DECK,
            deck
        }
        store.dispatch(action);
    } else {
        const action: FailedToGetDeckAction = {
            type: DeckViewerEnum.FAILED_TO_GET_DECK
        }
        store.dispatch(action);
    }
}

const getDeckWithName = async (deckName: string) => {
    try {
        store.dispatch({ type: DeckViewerEnum.LOADING_DECK}); 
        const fetched = await fetch(HOST_URL + '/deck/' + deckName);
        if (fetched.ok) {
            const deck: Deck = await fetched.json();
            return deck;
        }
        return null;
    } catch (err) {
        return null;
    }
}

export const dispatchGetDeckList = async () => {
    const deckList = await getDeckList(); 
    if(deckList){
        const action: GotDeckListAction = {
            type: DeckViewerEnum.GOT_DECK_LIST,
            deckList
        }
        store.dispatch(action); 
    }
}

const getDeckList = async () => {
    try {
        store.dispatch({ type: DeckViewerEnum.LOADING_DECK_LIST}); 
        const fetched = await fetch(HOST_URL + '/deckList');
        if (fetched.ok) {
            const deckList: Deck[] = await fetched.json();
            return deckList;  
        }
        return null; 
    } catch (err) {
        return null; 
    }
}