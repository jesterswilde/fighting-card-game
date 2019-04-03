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
exports.makeDeck = (user) => {
    const deck = new deck_1.DBDeck();
    deck.user = user;
    deck.name = "New Deck";
    db_1.deckRepo.save(deck);
};
exports.deleteDeck = (user, deckID) => __awaiter(this, void 0, void 0, function* () {
    // const deck = await deckRepo.findOne(deckID); 
    // if(deck){
    //     deckRepo.delete(deck); 
    // }
    const deck = yield getValidDeck(user, deckID);
    db_1.deckRepo.delete(deck);
});
exports.updateDeckCards = (user, deckID, cardNames) => __awaiter(this, void 0, void 0, function* () {
    const deck = yield getValidDeck(user, deckID);
    const cardsQuery = cardNames.map((name) => ({ name }));
    const cards = yield db_1.cardRepo.find({
        where: cardsQuery
    });
    deck.cards = cards;
    db_1.deckRepo.save(deck);
});
exports.updateDeckStyles = (user, deckID, styles) => __awaiter(this, void 0, void 0, function* () {
    if (styles.length > config_1.MAX_STYLES) {
        return;
    }
    const deck = yield getValidDeck(user, deckID);
});
const getValidDeck = (user, deckID) => __awaiter(this, void 0, void 0, function* () {
    const deck = yield db_1.deckRepo.findOne({ id: deckID });
    if (deck.user.id !== user.id) {
        throw error_1.ErrorEnum.DOESNT_OWN_DECK;
    }
    return deck;
});
