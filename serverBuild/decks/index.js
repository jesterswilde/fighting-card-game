"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersDecks = exports.getUsersDeck = exports.updateDeck = exports.deleteDeck = exports.makeDeck = void 0;
const deck_1 = require("../db/entities/deck");
const db_1 = require("../db");
const error_1 = require("../error");
const config_1 = require("../config");
const styles_1 = require("../styles");
const validation_1 = require("./validation");
exports.makeDeck = async (user, deckToMake = null) => {
    const dbDeck = new deck_1.DBDeck();
    dbDeck.user = user;
    if (deckToMake) {
        dbDeck.cards = deckToMake.deckList;
        dbDeck.description = deckToMake.description;
        dbDeck.name = deckToMake.name;
        dbDeck.styles = deckToMake.styles;
    }
    await db_1.deckRepo.save(dbDeck);
    return dbDeck.toDeck();
};
exports.deleteDeck = async (user, deckID) => {
    const deck = await validation_1.getValidDeck(user, deckID);
    db_1.deckRepo.delete(deck);
};
exports.updateDeck = async (user, deckID, deckUpdates) => {
    const dbDeck = await validation_1.getValidDeck(user, deckID);
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
    await db_1.deckRepo.save(dbDeck);
};
const updateDeckStyles = async (dbDeck, styles) => {
    const validStyles = styles
        .map(styles_1.getFightingStyleByName)
        .filter((style) => style !== null)
        .map(({ name }) => name);
    if (validStyles.length > config_1.MAX_STYLES) {
        throw error_1.ErrorEnum.TOO_MANY_STYLES;
    }
    dbDeck.styles = validStyles;
};
const updateDeckCards = (dbDeck, cards) => {
    if (validation_1.areCardsInStyles(dbDeck.styles, cards)) {
        dbDeck.cards = cards;
    }
    else {
        throw error_1.ErrorEnum.CARDS_ARENT_IN_STYLES;
    }
};
exports.getUsersDeck = async (user, deckID) => {
    const deck = await validation_1.getValidDeck(user, deckID);
    const unityDeck = {
        name: deck.name,
        deckList: deck.cards,
        styles: deck.styles,
        description: deck.description,
    };
    return unityDeck;
};
exports.getUsersDecks = async (user) => {
    const decks = await db_1.deckRepo.find({ user: user });
    return decks.map(({ name, id, description, styles }) => ({ name, id, description, styles }));
};
