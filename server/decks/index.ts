import { DBDeck } from "../db/entities/deck";
import { DBUser } from "../db/entities/user";
import { deckRepo } from "../db";
import { ErrorEnum } from "../error";
import { MAX_STYLES } from "../config";
import { getFightingStyleByName, getFullFightingStyleByName } from "../styles";
import { getValidDeck, areCardsInStyles } from "./validation";
import { EditedDeck, PossibleCards } from "./interface";

export const makeDeck = async (user: DBUser) => {
    const deck = new DBDeck();
    deck.user = user;
    deck.name = "New Deck";
    await deckRepo.save(deck);
    return deck.sendToUser();
}

export const deleteDeck = async (user: DBUser, deckID: number) => {
    const deck = await getValidDeck(user, deckID);
    deckRepo.delete(deck);
}

export const updateDeck = async (user: DBUser, deckID: number, deckUpdates: EditedDeck) => {
    const deck = await getValidDeck(user, deckID);
    if (deckUpdates.styles) {
        updateDeckStyles(deck, deckUpdates.styles);
    }
    if (deckUpdates.cards) {
        updateDeckCards(deck, deckUpdates.cards);
    }
    if (deckUpdates.name) {
        deck.name = deckUpdates.name;
    }
    if (deckUpdates.description) {
        deck.description = deckUpdates.description;
    }
    await deckRepo.save(deck);
}

const updateDeckStyles = async (deck: DBDeck, styles: string[]) => {
    const validStyles = styles
        .map(getFightingStyleByName)
        .filter((style) => style !== null)
        .map(({ name }) => name);
    if (validStyles.length > MAX_STYLES) {
        throw ErrorEnum.TOO_MANY_STYLES
    }
    deck.styles = validStyles;
}

const updateDeckCards = (deck: DBDeck, cards: string[]) => {
    if (areCardsInStyles(deck.styles, cards)) {
        deck.cards = cards;
    } else {
        throw ErrorEnum.CARDS_ARENT_IN_STYLES;
    }
}

export const getFullDeck = async (user: DBUser, deckID: number) => {
    const deck = await getValidDeck(user, deckID);
    const possibleCards = getPossibleCards(deck.styles);
    return deck.sendToUser(possibleCards)
}

//Styles give a pool of possible cards they could put in their deck. This gets those. 
export const getPossibleCards = (styles: string[]): PossibleCards => {
    const possibleCards = styles.map(getFullFightingStyleByName)
        .reduce((cardsObj, { cards, name }) => {
            cardsObj[name] = cards;
            return cardsObj;
        }, {});
    return possibleCards;
}

export const getUsersDecks = async (user: DBUser) => {
    return user.decks.map(({ name, id, description }) => ({ name, id, description }));
}