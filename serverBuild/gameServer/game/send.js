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
exports.sendHand = (state) => {
    const { agents, hands } = state;
    agents.forEach((agent, currentPlayer) => {
        const handsToSend = hands.map((hand, player) => {
            if (player === currentPlayer) {
                return hand;
            }
            return hand.map((card) => (card.isFaceUp ? card : null));
        });
        agent.sendHand(handsToSend);
    });
};
exports.playersChooseCardToPlay = (state) => __awaiter(this, void 0, void 0, function* () {
    const choicePromises = state.agents.map((agent) => agent.getCardChoice());
    const choices = yield Promise.all(choicePromises);
    choices.forEach((choice, player) => {
        state.pickedCards[player] = state.hands[player][choice];
        const unpickedCards = state.hands[player].filter((card, index) => {
            return index != choice && !card.isTemporary;
        });
        state.decks[player] = [...state.decks[player], ...unpickedCards];
        state.hands[player] = [];
    });
});
exports.sendState = (state) => {
    if (!state) {
        return;
    }
    console.log("Sending State");
    state.agents.forEach((agent) => {
        agent.sendState(state);
    });
};
/*
const stripCardForPred = (pred: PredictionState) => {
    return { prediction: pred.prediction, mechanics: pred.readiedEffects.map((reaEff) => reaEff.mechanic) }
}
*/
