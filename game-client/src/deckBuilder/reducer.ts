import { DeckEditState } from "./interface";
import { ActionType } from "../state/actionTypes";
import { DeckEditorEnum } from "./actions";

export const deckEditorReducer = (state: DeckEditState = makeDefaultState(), action: ActionType): DeckEditState => {
    switch (action.type) {
        case DeckEditorEnum.CHANGE_NAME:
            return { ...state, deck: { ...state.deck, name: action.name }, canUpdate: true }
        case DeckEditorEnum.CHOSE_DECK:
            var showing = action.deck.styles.length < 3;
            var possibleCards = { ...state.possibleCards, ...action.possibleCards };
            return { ...state, possibleCards, deck: action.deck, uneditedDeck: action.deck, canUpdate: false, showingUnusedStyles: showing }
        case DeckEditorEnum.GOT_DECKS:
            return { ...state, allDecks: action.decks }
        case DeckEditorEnum.ADD_CARD:
            var cards = [...state.deck.cards, action.card]
            return { ...state, deck: { ...state.deck, cards }, canUpdate: true }
        case DeckEditorEnum.REMOVE_CARD:
            var cards = state.deck.cards.filter((card) => card !== action.card)
            return { ...state, deck: { ...state.deck, cards }, canUpdate: true }
        case DeckEditorEnum.ADD_STYLE:
            var styles = [...state.deck.styles, action.style];
            return { ...state, deck: { ...state.deck, styles }, canUpdate: true }
        case DeckEditorEnum.REMOVE_STYLE:
            var styles = state.deck.styles.filter((style) => style !== action.style);
            return { ...state, deck: { ...state.deck, styles }, canUpdate: true }
        case DeckEditorEnum.UPDATE_DECK:
            return { ...state, uneditedDeck: { ...state.deck }, canUpdate: false }
        case DeckEditorEnum.REVERT_DECK:
            return { ...state, deck: { ...state.uneditedDeck }, canUpdate: false }
        case DeckEditorEnum.DELETE_DECK:
            var allDecks = state.allDecks.filter(({ id }) => id !== action.id)
            return { ...state, allDecks }
        case DeckEditorEnum.GOT_POSSIBLE_CARDS:
            var possibleCards = { ...state.possibleCards, ...action.possibleCards };
            return { ...state, possibleCards }
        case DeckEditorEnum.SHOWING_UNUSED_STYLES:
            return { ...state, showingUnusedStyles: action.showing }
        default:
            return state;
    }
}

const makeDefaultState = (): DeckEditState => {
    return {
        canUpdate: false,
        deck: null,
        allDecks: [],
        savedStyles: {},
        allStyleDesc: [],
        uneditedDeck: null,
        showingUnusedStyles: false,
        possibleCards: {},
    }
}