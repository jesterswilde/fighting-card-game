import { DBDeck } from "../db/entities/deck";
import { DBUser } from "../db/entities/user";
import { deckRepo, userRepo } from "../db";
import { ErrorEnum } from "../error";
import { MAX_STYLES } from "../config";
import { getFightingStyleByName } from "../styles";
import { getValidDeck, areCardsInStyles } from "./validation";
import { Deck} from "./interface";

export const makeDeck = async (user: DBUser, deckToMake: Deck = null) => {
    const dbDeck = new DBDeck();
    dbDeck.user = user;
    if(deckToMake){
        dbDeck.cards = deckToMake.deckList;
        dbDeck.description = deckToMake.description;
        dbDeck.name = deckToMake.name; 
        dbDeck.styles = deckToMake.styles; 
    }
    await deckRepo.save(dbDeck);
    return dbDeck.toDeck();
}

export const deleteDeck = async (user: DBUser, deckID: number) => {
    const deck = await getValidDeck(user, deckID);
    deckRepo.delete(deck);
}

export const updateDeck = async (user: DBUser, deckID: number, deckUpdates: Deck) => {
    const dbDeck = await getValidDeck(user, deckID);
    if (deckUpdates.styles) {
        updateDeckStyles(dbDeck, deckUpdates.styles);
    }
    if (deckUpdates.deckList) {
        updateDeckCards(dbDeck, deckUpdates.deckList);
    }
    if (deckUpdates.name) {
        dbDeck.name = deckUpdates.name;
    }
    if (deckUpdates.description) {
        dbDeck.description = deckUpdates.description;
    }
    await deckRepo.save(dbDeck);
}

const updateDeckStyles = async (dbDeck: DBDeck, styles: string[]) => {
    const validStyles = styles
        .map(getFightingStyleByName)
        .filter((style) => style !== null)
        .map(({ name }) => name);
    if (validStyles.length > MAX_STYLES) {
        throw ErrorEnum.TOO_MANY_STYLES
    }
    dbDeck.styles = validStyles;
}

const updateDeckCards = (dbDeck: DBDeck, cards: string[]) => {
    if (areCardsInStyles(dbDeck.styles, cards)) {
        dbDeck.cards = cards;
    } else {
        throw ErrorEnum.CARDS_ARENT_IN_STYLES;
    }
}

export const getUsersDeck = async(user: DBUser, deckID: number)=>{
    const deck = await getValidDeck(user, deckID); 
    const unityDeck: Deck = {
        name: deck.name,
        deckList: deck.cards,
        styles: deck.styles,
        description: deck.description,
    }
    return unityDeck; 
}

export const getUsersDecks = async (user: DBUser) => {
    const decks = await deckRepo.find({user: user})
    return decks.map(({ name, id, description, styles }) => ({ name, id, description, styles }));
}