/// <reference path="./interface.ts" />
import { DeckDescription } from "../deckViewer/interface";

namespace DeckBuilder {
    export enum DeckEditorEnum {
        ADD_STYLE = 'deckEditAddStye',
        REMOVE_STYLE = 'deckEditRemoveStyle',
        ADD_CARD = 'deckEditAddCard',
        REMOVE_CARD = 'deckEditRemoveCard',
        GOT_DECKS = 'deckEditGotDecks',
        CHOSE_DECK = 'deckEditChoseDeck',
        UPDATE_DECK = 'deckEditUpdateDeck',
        CREATE_DECK = 'deckEditCreateDeck',
        DELETE_DECK = 'deckEditDelteDeck',
    }

    export interface DEUpdateDeckAction {
        type: DeckEditorEnum.UPDATE_DECK
    }

    export interface DECreateDeckAction {
        type: DeckEditorEnum.CREATE_DECK
        deck: EditingDeck
    }

    export interface DEDeleteDeckAction {
        type: DeckEditorEnum.DELETE_DECK
        id: number
    }

    export interface DEGotDecksAction {
        type: DeckEditorEnum.GOT_DECKS,
        decks: DeckDescription[]
    }

    export interface DEChoseDeckAction {
        type: DeckEditorEnum.CHOSE_DECK
        deck: EditingDeck
    }

    export interface DEAddStyleAction {
        type: DeckEditorEnum.ADD_STYLE,
        style: string
    }

    export interface DERemoveStyleAction {
        type: DeckEditorEnum.REMOVE_STYLE,
        style: string
    }

    export interface DEAddCardAction {
        type: DeckEditorEnum.ADD_CARD,
        card: string
    }

    export interface DERemoveCardAction {
        type: DeckEditorEnum.REMOVE_CARD,
        card: string
    }

    export type DeckEditorActions = DEAddCardAction | DERemoveCardAction | DEAddStyleAction |
        DERemoveStyleAction | DEChoseDeckAction | DEGotDecksAction | DECreateDeckAction | DEUpdateDeckAction |
        DEDeleteDeckAction

}
