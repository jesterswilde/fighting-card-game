"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCrippleCardToOpponentsDeck = void 0;
const Cards_1 = require("../../../cards/Cards");
/*
    Cripple adds a (bad) card to the opponents deck.
    Cripple currently uses a special lookup object. This can be found under the getCardByName function (../playCards/getCard)
    This is cuz I'm lazy and I didn't want to have an extra section on the card that said the name that will get printed, and a seperate section that had the name of the card
*/
exports.addCrippleCardToOpponentsDeck = async (effect, card, player, opponent, state) => {
    const { decks } = state;
    const crippleCard = Cards_1.getCardByName("Crippled " + effect.detail);
    crippleCard.player = opponent;
    crippleCard.opponent = player;
    crippleCard.isFaceUp = true;
    decks[opponent].push(crippleCard);
};
