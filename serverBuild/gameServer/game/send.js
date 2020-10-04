"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendHand = (state) => {
    const { agents, hands } = state;
    agents.forEach((agent, currentPlayer) => {
        const handsToSend = hands.map((hand, player) => {
            if (player === currentPlayer) {
                return hand;
            }
            return hand.map((card) => card.isFaceUp ? card : null);
        });
        agent.sendHand(handsToSend);
    });
};
exports.sendState = (state) => {
    if (!state) {
        return;
    }
    state.agents.forEach(agent => {
        agent.sendState(state);
    });
};
/*
const stripCardForPred = (pred: PredictionState) => {
    return { prediction: pred.prediction, mechanics: pred.readiedEffects.map((reaEff) => reaEff.mechanic) }
}
*/ 
