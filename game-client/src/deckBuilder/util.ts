import { UpdateDeckObj } from "./interface";
import { store } from "../state/store";
import isEqual from 'lodash/isEqual'

export const getUpdateDeckObj = (): { updateDeckObj: UpdateDeckObj, id: number } => {
    const updateDeckObj: UpdateDeckObj = {};
    const { deckEditor: { deck, uneditedDeck } } = store.getState();
    if (!isEqual(deck.cards, uneditedDeck.cards)) {
        updateDeckObj.cards = deck.cards;
    }
    if (!isEqual(deck.styles, uneditedDeck.styles)) {
        updateDeckObj.styles = deck.styles;
    }
    if (deck.name !== uneditedDeck.name) {
        updateDeckObj.name = deck.name;
    }
    if (deck.description !== uneditedDeck.description) {
        updateDeckObj.description = deck.description;
    }
    return { updateDeckObj, id: deck.id };
}