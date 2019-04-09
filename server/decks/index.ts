import { DBDeck } from "../db/entities/deck";
import { DBUser } from "../db/entities/user";
import { deckRepo } from "../db";
import { ErrorEnum } from "../error";
import { MAX_STYLES } from "../config";
import { getFightingStyleByName, getFullFightingStyleByName } from "../styles";
import { allCards } from "../cards/Cards";

export const makeDeck = (user: DBUser) => {
    const deck = new DBDeck();
    deck.user = user;
    deck.name = "New Deck";
    deckRepo.save(deck);
}

export const deleteDeck = async (user: DBUser, deckID: number) => {
    const deck = await getValidDeck(user, deckID);
    deckRepo.delete(deck);
}

export const updateDeckCards = async (user: DBUser, deckID: number, cardNames: string[]) => {
    const deck = await getValidDeck(user, deckID);
    if (areCardsInStyles(deck.styles, cardNames)) {
        deck.cards = cardNames;
        deckRepo.save(deck);
    } else {
        throw ErrorEnum.CARDS_ARENT_IN_STYLES
    }
}

const areCardsInStyles = (styleNames: string[], cards: string[]) => {
    const stylesObj = styleNames.map((name) => getFightingStyleByName(name))
        .filter((style) => style !== null)
        .reduce((styleObj, style) => {
            style.cards.forEach((cardName) => {
                const card = allCards[cardName];
                if (card) {
                    styleObj[cardName] = card;
                }
            });
            return styleObj;
        }, {})
    return cards.every((cardName) => stylesObj[cardName] !== undefined && stylesObj[cardName] !== null);
}

export const updateDeckStyles = async (user: DBUser, deckID: number, styles: string[]) => {
    const validStyles = styles
        .map(getFightingStyleByName)
        .filter((style) => style !== null)
        .map(({ name }) => name);
    if (validStyles.length > MAX_STYLES) {
        throw ErrorEnum.TOO_MANY_STYLES
    }
    const deck = await getValidDeck(user, deckID);
    deck.styles = validStyles;
}

const getValidDeck = async (user: DBUser, deckID: number) => {
    const deck = await deckRepo.findOne({ id: deckID });
    if (deck.user.id !== user.id) {
        throw ErrorEnum.DOESNT_OWN_DECK;
    }
    return deck;
}

export const getFullDeck = async (user: DBUser, deckID: number) => {
    const deck = await getValidDeck(user, deckID);
    const possibleCards2D = deck.styles.map(getFullFightingStyleByName).map(({ cards }) => cards);
    const possibleCards = possibleCards2D.reduce((result, cards) => {
        result.push(...cards);
        return result;
    }, [])
    return {
        ...deck,
        possibleCards
    }
}