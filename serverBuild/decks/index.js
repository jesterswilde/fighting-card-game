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
const Cards_1 = require("../cards/Cards");
exports.makeDeck = (user) => {
    const deck = new deck_1.DBDeck();
    deck.user = user;
    deck.name = "New Deck";
    db_1.deckRepo.save(deck);
};
exports.deleteDeck = (user, deckID) => __awaiter(this, void 0, void 0, function* () {
    const deck = yield getValidDeck(user, deckID);
    db_1.deckRepo.delete(deck);
});
exports.updateDeckCards = (user, deckID, cardNames) => __awaiter(this, void 0, void 0, function* () {
    const deck = yield getValidDeck(user, deckID);
    if (areCardsInStyles(deck.styles, cardNames)) {
        deck.cards = cardNames;
        db_1.deckRepo.save(deck);
    }
    else {
        throw error_1.ErrorEnum.CARDS_ARENT_IN_STYLES;
    }
});
const areCardsInStyles = (styleNames, cards) => {
    const stylesObj = styleNames.map((name) => styles_1.getFightingStyleByName(name))
        .filter((style) => style !== null)
        .reduce((styleObj, style) => {
        style.cards.forEach((cardName) => {
            const card = Cards_1.allCards[cardName];
            if (card) {
                styleObj[cardName] = card;
            }
        });
        return styleObj;
    }, {});
    return cards.every((cardName) => stylesObj[cardName] !== undefined && stylesObj[cardName] !== null);
};
exports.updateDeckStyles = (user, deckID, styles) => __awaiter(this, void 0, void 0, function* () {
    const validStyles = styles
        .map(styles_1.getFightingStyleByName)
        .filter((style) => style !== null)
        .map(({ name }) => name);
    if (validStyles.length > config_1.MAX_STYLES) {
        throw error_1.ErrorEnum.TOO_MANY_STYLES;
    }
    const deck = yield getValidDeck(user, deckID);
    deck.styles = validStyles;
});
const getValidDeck = (user, deckID) => __awaiter(this, void 0, void 0, function* () {
    const deck = yield db_1.deckRepo.findOne({ id: deckID });
    if (deck.user.id !== user.id) {
        throw error_1.ErrorEnum.DOESNT_OWN_DECK;
    }
    return deck;
});
exports.getFullDeck = (user, deckID) => __awaiter(this, void 0, void 0, function* () {
    const deck = yield getValidDeck(user, deckID);
    const possibleCards2D = deck.styles.map(styles_1.getFullFightingStyleByName).map(({ cards }) => cards);
    const possibleCards = possibleCards2D.reduce((result, cards) => {
        result.push(...cards);
        return result;
    }, []);
    return Object.assign({}, deck, { possibleCards });
});
