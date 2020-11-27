"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValidDeck = exports.areCardsInStyles = void 0;
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
exports.getValidDeck = async (user, deckID) => {
    const deck = await db_1.deckRepo.findOne({
        where: { id: deckID },
        relations: ['user']
    });
    if (deck.user.id !== user.id) {
        throw error_1.ErrorEnum.DOESNT_OWN_DECK;
    }
    return deck;
};
