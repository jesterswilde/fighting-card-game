"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const deck_1 = require("../db/entities/deck");
const db_1 = require("../db");
const error_1 = require("../error");
const config_1 = require("../config");
const styles_1 = require("../styles");
const validation_1 = require("./validation");
exports.makeDeck = (user, deckToMake = null) => __awaiter(this, void 0, void 0, function* () {
    const dbDeck = new deck_1.DBDeck();
    dbDeck.user = user;
    if (deckToMake) {
        dbDeck.cards = deckToMake.deckList;
        dbDeck.description = deckToMake.description;
        dbDeck.name = deckToMake.name;
        dbDeck.styles = deckToMake.styles;
    }
    yield db_1.deckRepo.save(dbDeck);
    return dbDeck.toDeck();
});
exports.deleteDeck = (user, deckID) => __awaiter(this, void 0, void 0, function* () {
    const deck = yield validation_1.getValidDeck(user, deckID);
    db_1.deckRepo.delete(deck);
});
exports.updateDeck = (user, deckID, deckUpdates) => __awaiter(this, void 0, void 0, function* () {
    const dbDeck = yield validation_1.getValidDeck(user, deckID);
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
    yield db_1.deckRepo.save(dbDeck);
});
const updateDeckStyles = (dbDeck, styles) => __awaiter(this, void 0, void 0, function* () {
    const validStyles = styles
        .map(styles_1.getFightingStyleByName)
        .filter((style) => style !== null)
        .map(({ name }) => name);
    if (validStyles.length > config_1.MAX_STYLES) {
        throw error_1.ErrorEnum.TOO_MANY_STYLES;
    }
    dbDeck.styles = validStyles;
});
const updateDeckCards = (dbDeck, cards) => {
    if (validation_1.areCardsInStyles(dbDeck.styles, cards)) {
        dbDeck.cards = cards;
    }
    else {
        throw error_1.ErrorEnum.CARDS_ARENT_IN_STYLES;
    }
};
exports.getUsersDeck = (user, deckID) => __awaiter(this, void 0, void 0, function* () {
    const deck = yield validation_1.getValidDeck(user, deckID);
    const unityDeck = {
        name: deck.name,
        deckList: deck.cards,
        styles: deck.styles,
        description: deck.description,
    };
    return unityDeck;
});
exports.getUsersDecks = (user) => __awaiter(this, void 0, void 0, function* () {
    const decks = yield db_1.deckRepo.find({ user: user });
    return decks.map(({ name, id, description, styles }) => ({ name, id, description, styles }));
});
