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
const error_1 = require("../error");
const styles_1 = require("../styles");
let styleByCard = null;
const sortCardsByStyle = () => {
    styleByCard = {};
    styles_1.getAllFightingStylesArr().forEach(style => {
        style.cards.forEach(cardName => {
            styleByCard[cardName] = style.name;
        });
    });
};
//All styles offer a pool of cards. This makes sure that any card they submit is valid. 
exports.areCardsInStyles = (styleNames, cards) => {
    if (styleByCard == null)
        sortCardsByStyle();
    const stylesSet = new Set([...styleNames, 'Generic']);
    return cards.every((cardName) => stylesSet.has(styleByCard[cardName]));
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
