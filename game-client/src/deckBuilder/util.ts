import { UpdateDeckObj } from "./interface";
import { store } from "../state/store";
import isEqual from 'lodash/isEqual'

export const getUpdateDeckObj = (): { updateDeckObj: UpdateDeckObj, id: number } => {
    const updateDeckObj: UpdateDeckObj = {};
    const { deckEditor: { deck, uneditedDeck } } = store.getState();
    const cardsChanged = !isEqual(deck.cards, uneditedDeck.cards)
    const stylesChanged = !isEqual(deck.styles, uneditedDeck.styles)
    if (stylesChanged) {
        updateDeckObj.styles = deck.styles;
    }
    if (stylesChanged || cardsChanged) {
        updateDeckObj.cards = deck.cards.filter((cardName) => {
            for (const style in deck.possibleCards) {
                const cards = deck.possibleCards[style];
                const hasCard = cards.some(({ name }) => name === cardName);
                if (hasCard) {
                    return true;
                }
            }
            return false;
        });
    }
    if (deck.name !== uneditedDeck.name) {
        updateDeckObj.name = deck.name;
    }
    if (deck.description !== uneditedDeck.description) {
        updateDeckObj.description = deck.description;
    }
    return { updateDeckObj, id: deck.id };
}