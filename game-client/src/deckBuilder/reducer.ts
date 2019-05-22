import { DeckEditState } from "./interface";
import { ActionType } from "../state/actionTypes";
import { DeckEditorEnum } from "./actions";

export const deckEditorReducer = (state: DeckEditState = makeDefaultState(), action: ActionType): DeckEditState => {
    switch (action.type) {
        case DeckEditorEnum.CHOSE_DECK:
            return { ...state, deck: action.deck, uneditedDeck: action.deck }
        case DeckEditorEnum.GOT_DECKS:
            return { ...state, allDecks: action.decks }
        case DeckEditorEnum.ADD_CARD:
            var cards = [...state.deck.cards, action.card]
            return { ...state, deck: { ...state.deck, cards } }
        case DeckEditorEnum.REMOVE_CARD:
            var cards = state.deck.cards.filter((card) => card !== action.card)
            return { ...state, deck: { ...state.deck, cards } }
        case DeckEditorEnum.ADD_STYLE:
            var styles = [...state.deck.styles, action.style];
            return { ...state, deck: { ...state.deck, styles } }
        case DeckEditorEnum.REMOVE_STYLE:
            var styles = state.deck.styles.filter((style) => style !== action.style);
            return { ...state, deck: { ...state.deck, styles } }
        case DeckEditorEnum.UPDATE_DECK:
            return { ...state, uneditedDeck: { ...state.deck } }
        case DeckEditorEnum.REVERT_DECK:
            return { ...state, deck: { ...state.uneditedDeck } }
        case DeckEditorEnum.DELETE_DECK:
            var allDecks = state.allDecks.filter(({ id }) => id !== action.id)
            return { ...state, allDecks }
        case DeckEditorEnum.GOT_POSSIBLE_CARDS:
            return { ...state, deck: { ...state.deck, possibleCards: action.possibleCards } }
        default:
            return state;
    }
}

const makeDefaultState = (): DeckEditState => {
    return {
        deck: null,
        allDecks: [],
        savedStyles: {},
        allStyleDesc: [],
        uneditedDeck: null,
    }
}