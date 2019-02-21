import { Deck, DeckDescription, DeckViewerFilter } from "./interface";

export enum DeckViewerEnum {
    GOT_DECK = "gotDeck",
    GOT_DECK_LIST = "gotDeckList",
    FAILED_TO_GET_DECK = "failedToGetDeck",
    FAILED_TO_GET_DECKLIST = "faileToGetDecklist",
    LOADING_DECK = 'loadingDeck', 
    LOADING_DECK_LIST = 'loadingDeckList',
    UPDATED_FILTER = 'updateDeckViewerFilter',
    ADDED_FILTER = 'addDeckViewerFilter',
    REMOVED_FILTER = 'removeDeckViewerFilter',
}

export interface UpdateDVFilterAction{
    type: DeckViewerEnum.UPDATED_FILTER,
    filter: DeckViewerFilter,
    index: number
}

export interface AddDVFilterAction {
    type: DeckViewerEnum.ADDED_FILTER,
}

export interface RemoveDVFilterAction{
    type: DeckViewerEnum.REMOVED_FILTER,
    index: number
}

export interface LoadingDeckAction{
    type: DeckViewerEnum.LOADING_DECK
}

export interface LoadingDeckListAction{
    type: DeckViewerEnum.LOADING_DECK_LIST
}

export interface FailedToGetDeckListAction{
    type: DeckViewerEnum.FAILED_TO_GET_DECKLIST
}

export interface FailedToGetDeckAction{
    type: DeckViewerEnum.FAILED_TO_GET_DECK
}

export interface GotDeckActioin{
    type: DeckViewerEnum.GOT_DECK
    deck: Deck
}

export interface GotDeckListAction {
    type: DeckViewerEnum.GOT_DECK_LIST
    deckList: DeckDescription[]
}

export type DeckViewerActions = GotDeckActioin | GotDeckListAction | FailedToGetDeckAction | FailedToGetDeckListAction | 
LoadingDeckAction | LoadingDeckListAction | UpdateDVFilterAction | AddDVFilterAction | RemoveDVFilterAction; 