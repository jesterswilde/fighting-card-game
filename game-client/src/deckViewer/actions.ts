import { Deck, DeckDescription } from "./interface";

export enum DeckViewerEnum {
    GOT_DECK = "gotDeck",
    GOT_DECK_LIST = "gotDeckList",
    FAILED_TO_GET_DECK = "failedToGetDeck",
    FAILED_TO_GET_DECKLIST = "faileToGetDecklist",
    LOADING_DECK = 'loadingDeck', 
    LOADING_DECK_LIST = 'loadingDeckList',
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
LoadingDeckAction | LoadingDeckListAction; 