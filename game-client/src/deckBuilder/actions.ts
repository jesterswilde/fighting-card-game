import { DeckDescription } from "../deckViewer/interface";
import { EditingDeck } from "./interface";
import { FightingStyleDescription } from "../fightingStyles/interface";
import { Card } from "../shared/card";

export enum DeckEditorEnum {
    CHANGE_NAME = 'deckEditChangeName', 
    ADD_STYLE = 'deckEditAddStyle',
    REMOVE_STYLE = 'deckEditRemoveStyle',
    ADD_CARD = 'deckEditAddCard',
    REMOVE_CARD = 'deckEditRemoveCard',
    GOT_DECKS = 'deckEditGotDecks',
    CHOSE_DECK = 'deckEditChoseDeck',
    UPDATE_DECK = 'deckEditUpdateDeck',
    CREATE_DECK = 'deckEditCreateDeck',
    DELETE_DECK = 'deckEditDelteDeck',
    REVERT_DECK = 'deckEditRevertDeck',
    EXTERNALLY_VIEWING = 'deckEditIsExternallyViewing',
    GOT_POSSIBLE_CARDS = 'gotPossibleCards',
}

export interface ChangeDeckNameAction {
    type: DeckEditorEnum.CHANGE_NAME,
    name: string
}

export interface GotPossibleCardsAction {
    type: DeckEditorEnum.GOT_POSSIBLE_CARDS,
    possibleCards: { [style: string]: Card[] }
}

export interface ExternallyViewingAction {
    type: DeckEditorEnum.EXTERNALLY_VIEWING
    value: boolean
}

export interface RevertDeckAction {
    type: DeckEditorEnum.REVERT_DECK
}

export interface UpdateDeckAction {
    type: DeckEditorEnum.UPDATE_DECK
}

export interface CreateDeckAction {
    type: DeckEditorEnum.CREATE_DECK
    deck: EditingDeck
}

export interface DeleteDeckAction {
    type: DeckEditorEnum.DELETE_DECK
    id: number
}

export interface GotDecksAction {
    type: DeckEditorEnum.GOT_DECKS,
    decks: DeckDescription[]
}

export interface ChoseDeckAction {
    type: DeckEditorEnum.CHOSE_DECK
    deck: EditingDeck
}

export interface AddStyleAction {
    type: DeckEditorEnum.ADD_STYLE,
    style: string
}

export interface RemoveStyleAction {
    type: DeckEditorEnum.REMOVE_STYLE,
    style: string
}

export interface AddCardAction {
    type: DeckEditorEnum.ADD_CARD,
    card: string
}

export interface RemoveCardAction {
    type: DeckEditorEnum.REMOVE_CARD,
    card: string
}

export type DeckEditorActions = AddCardAction | RemoveCardAction | AddStyleAction |
    RemoveStyleAction | ChoseDeckAction | GotDecksAction | CreateDeckAction | UpdateDeckAction |
    DeleteDeckAction | RevertDeckAction | ExternallyViewingAction | GotPossibleCardsAction | ChangeDeckNameAction

