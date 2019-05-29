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
const premade_1 = require("./premade");
exports.makeDeck = (user) => __awaiter(this, void 0, void 0, function* () {
    const deck = new deck_1.DBDeck();
    deck.user = user;
    yield db_1.deckRepo.save(deck);
    return deck.sendToUser();
});
exports.deleteDeck = (user, deckID) => __awaiter(this, void 0, void 0, function* () {
    const deck = yield validation_1.getValidDeck(user, deckID);
    db_1.deckRepo.delete(deck);
});
exports.updateDeck = (user, deckID, deckUpdates) => __awaiter(this, void 0, void 0, function* () {
    const deck = yield validation_1.getValidDeck(user, deckID);
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
    yield db_1.deckRepo.save(deck);
});
const updateDeckStyles = (deck, styles) => __awaiter(this, void 0, void 0, function* () {
    const validStyles = styles
        .map(styles_1.getFightingStyleByName)
        .filter((style) => style !== null)
        .map(({ name }) => name);
    if (validStyles.length > config_1.MAX_STYLES) {
        throw error_1.ErrorEnum.TOO_MANY_STYLES;
    }
    deck.styles = validStyles;
});
const updateDeckCards = (deck, cards) => {
    if (validation_1.areCardsInStyles(deck.styles, cards)) {
        deck.cards = cards;
    }
    else {
        throw error_1.ErrorEnum.CARDS_ARENT_IN_STYLES;
    }
};
exports.getFullDeck = (user, deckID) => __awaiter(this, void 0, void 0, function* () {
    const deck = yield validation_1.getValidDeck(user, deckID);
    const possibleCards = exports.getPossibleCards(deck.styles);
    return deck.sendToUser(possibleCards);
});
//Styles give a pool of possible cards they could put in their deck. This gets those. 
exports.getPossibleCards = (styles) => {
    const possibleCards = styles.map(styles_1.getFullFightingStyleByName)
        .reduce((cardsObj, { cards, name }) => {
        cardsObj[name] = cards;
        return cardsObj;
    }, {});
    return possibleCards;
};
exports.getUsersDecks = (user) => __awaiter(this, void 0, void 0, function* () {
    const decks = yield db_1.deckRepo.find({ user: user });
    return decks.map(({ name, id, description }) => ({ name, id, description }));
});
exports.getDeckOptions = (username) => __awaiter(this, void 0, void 0, function* () {
    const standardDecks = premade_1.getStandardDecks();
    if (!username) {
        return [...standardDecks];
    }
    const user = yield db_1.userRepo.findOne({ where: { username }, relations: ['decks'] });
    const userDecks = user.decks.map((deck) => ({ id: deck.id, name: deck.name, description: deck.description, isCustom: true }));
    return [...userDecks, ...standardDecks];
});
