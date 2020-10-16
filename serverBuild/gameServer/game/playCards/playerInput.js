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
const util_1 = require("../../util");
const predict_1 = require("../mechanics/predict");
const pickOne_1 = require("../mechanics/pickOne");
const forceful_1 = require("../mechanics/forceful");
const enhance_1 = require("../mechanics/enhance");
exports.playersPickCards = (state) => {
    const promiseArr = state.agents.map((_, player) => playerChoosesCard(player, state));
    return Promise.all(promiseArr);
};
exports.playersMakePredictions = (state) => {
    const promiseArr = state.agents.map((_, player) => predict_1.playerMakesPredictions(player, state));
    return Promise.all(promiseArr);
};
exports.playersMakeCardChoices = (state) => {
    const promiseArr = state.agents.map((_, player) => playerMakesCardChoices(player, state));
    return Promise.all(promiseArr);
};
const playerMakesCardChoices = (player, state) => __awaiter(this, void 0, void 0, function* () {
    yield pickOne_1.playerPicksOne(player, state);
    yield forceful_1.playerChoosesForce(player, state);
});
const playerChoosesCard = (player, state) => __awaiter(this, void 0, void 0, function* () {
    if (state.hands[player] === undefined || state.hands[player].length === 0) {
        return;
    }
    const agent = state.agents[player];
    const opponent = util_1.getOpponent(player);
    const cardIndex = yield agent.getCardChoice();
    exports.pickCard(player, cardIndex, state);
    state.agents[opponent].opponentMadeCardChoice();
});
exports.pickCard = (player, cardNumber, state) => {
    const { hands, decks } = state;
    const card = hands[player][cardNumber];
    const unusedCards = hands[player].filter((card, i) => i !== cardNumber && card.name !== "Panic");
    unusedCards.forEach(enhance_1.removeEnhancements);
    decks[player].push(...unusedCards);
    hands[player] = [];
    card.opponent = util_1.getOpponent(player);
    state.pickedCards[player] = card;
};
