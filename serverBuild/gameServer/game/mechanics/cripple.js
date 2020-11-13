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
const Cards_1 = require("../../../cards/Cards");
/*
    Cripple adds a (bad) card to the opponents deck.
    Cripple currently uses a special lookup object. This can be found under the getCardByName function (../playCards/getCard)
    This is cuz I'm lazy and I didn't want to have an extra section on the card that said the name that will get printed, and a seperate section that had the name of the card
*/
exports.addCrippleCardToOpponentsDeck = (effect, card, player, opponent, state) => __awaiter(this, void 0, void 0, function* () {
    const { decks } = state;
    const crippleCard = Cards_1.getCardByName("Crippled " + effect.detail);
    crippleCard.player = opponent;
    crippleCard.opponent = player;
    crippleCard.isFaceUp = true;
    decks[opponent].push(crippleCard);
});
