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
const db_1 = require("../db");
const Cards_1 = require("../cards/Cards");
const error_1 = require("../error");
const styles_1 = require("../styles");
//All styles offer a pool of cards. This makes sure that any card they submit is valid. 
exports.areCardsInStyles = (styleNames, cards) => {
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
//Just make sure the user owns the deck
exports.getValidDeck = (user, deckID) => __awaiter(this, void 0, void 0, function* () {
    const deck = yield db_1.deckRepo.findOne({
        where: { id: deckID },
        relations: ['user']
    });
    if (deck.user.id !== user.id) {
        throw error_1.ErrorEnum.DOESNT_OWN_DECK;
    }
    return deck;
});
