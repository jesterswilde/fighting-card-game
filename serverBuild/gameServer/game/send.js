"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendState = exports.playersChooseCardToPlay = exports.sendHand = void 0;
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
exports.playersChooseCardToPlay = async (state) => {
    const choicePromises = state.agents.map((agent) => agent.getCardChoice());
    const choices = await Promise.all(choicePromises);
    choices.forEach((choice, player) => {
        state.pickedCards[player] = state.hands[player][choice];
        const unpickedCards = state.hands[player].filter((card, index) => {
            return index != choice && !card.isTemporary;
        });
        state.decks[player] = [...state.decks[player], ...unpickedCards];
        state.hands[player] = [];
    });
};
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
