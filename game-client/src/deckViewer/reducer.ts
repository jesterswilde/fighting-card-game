import { DeckViewerState } from "./interface";
import { ActionType } from "../state/actionTypes";
import { DeckViewerEnum, } from "./actions";

export const deckViewerReducer = (state: DeckViewerState = {
    deck: null,
    deckList: [],
    isLoadingDeckList: false,
    isLoadingDeck: false,
}, action: ActionType): DeckViewerState => {
    switch (action.type) {
        case DeckViewerEnum.LOADING_DECK:
            return { ...state, isLoadingDeck: true };
        case DeckViewerEnum.GOT_DECK:
            return { ...state, deck: action.deck, isLoadingDeck: false };
        case DeckViewerEnum.LOADING_DECK_LIST:
            return { ...state, isLoadingDeckList: true };
        case DeckViewerEnum.GOT_DECK_LIST:
            return { ...state, deckList: action.deckList, isLoadingDeckList: false };
        default:
            return state;
    }
}
