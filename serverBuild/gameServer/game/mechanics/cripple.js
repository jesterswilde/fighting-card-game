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
const getCards_1 = require("../playCards/getCards");
/*
    Cripple adds a (bad) card to the opponents deck.
    Cripple currently uses a special lookup object. This can be found under the getCardByName function (../playCards/getCard)
    This is cuz I'm lazy and I didn't want to have an extra section on the card that said the name that will get printed, and a seperate section that had the name of the card
*/
exports.addCrippleCardToOpponentsDeck = (effect, card, player, opponent, state, { _getCardByName = getCards_1.getCardByName } = {}) => __awaiter(this, void 0, void 0, function* () {
    console.log("reducing cripple", player, opponent);
    const { decks } = state;
    let crippleKey = effect.detail;
    crippleKey = crippleKey.split(" ")[1]; //just turned "Cripple Leg" into leg which is the lookup key
    const crippleCard = _getCardByName(crippleKey);
    card.player = opponent;
    card.opponent = player;
    decks[opponent].push(crippleCard);
});
