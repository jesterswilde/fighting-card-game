import { DeckViewerState, DeckViewerFilter } from "./interface";
import { ActionType } from "../state/actionTypes";
import { DeckViewerEnum, UpdateDVFilterAction, AddDVFilterAction, RemoveDVFilterAction } from "./actions";

export const deckViewerReducer = (state: DeckViewerState = {
    deck: null,
    deckList: [],
    isLoadingDeckList: false,
    isLoadingDeck: false,
    filters: []
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
        case DeckViewerEnum.UPDATED_FILTER:
            return updateFilter(state, action);
        case DeckViewerEnum.ADDED_FILTER:
            return addFilter(state, action);
        case DeckViewerEnum.REMOVED_FILTER:
            return removeFilter(state, action);
        default:
            return state;
    }
}

const updateFilter = (state: DeckViewerState, action: UpdateDVFilterAction): DeckViewerState => {
    const filters = [...state.filters];
    filters[action.index] = action.filter;
    return { ...state, filters };
}
const addFilter = (state: DeckViewerState, action: AddDVFilterAction): DeckViewerState => {
    const filters: DeckViewerFilter[] = [...state.filters, { axis: -1, player: -1 }];
    return { ...state, filters };
}
const removeFilter = (state: DeckViewerState, action: RemoveDVFilterAction): DeckViewerState => {
    const filters = state.filters.filter((_, i) => i !== action.index);
    return { ...state, filters };
}