"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickCard = exports.playersMakeCardChoices = exports.playersMakePredictions = exports.playersPickCards = void 0;
const util_1 = require("../../util");
const predict_1 = require("../mechanics/predict");
const pickOne_1 = require("../mechanics/pickOne");
const forceful_1 = require("../mechanics/forceful");
const enhance_1 = require("../mechanics/enhance");
exports.playersPickCards = (state) => {
    if (state.pickedCards.length > 0 && state.pickedCards.some(card => card != null && card != undefined))
        return;
    const promiseArr = state.agents.map((_, player) => playerChoosesCard(player, state));
    return Promise.all(promiseArr);
};
exports.playersMakePredictions = (state) => {
    const promiseArr = state.agents.map((_, player) => predict_1.playerMakesPredictions(player, state));
    console.log("Predictions have happeend");
    return Promise.all(promiseArr);
};
exports.playersMakeCardChoices = (state) => {
    const promiseArr = state.agents.map((_, player) => playerMakesCardChoices(player, state));
    return Promise.all(promiseArr);
};
const playerMakesCardChoices = async (player, state) => {
    await pickOne_1.playerPicksOne(player, state);
    await forceful_1.playerChoosesForce(player, state);
};
const playerChoosesCard = async (player, state) => {
    if (state.hands[player] === undefined || state.hands[player].length === 0) {
        return;
    }
    const agent = state.agents[player];
    const opponent = util_1.getOpponent(player);
    const cardIndex = await agent.getCardChoice();
    exports.pickCard(player, cardIndex, state);
    state.agents[opponent].opponentMadeCardChoice();
};
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
