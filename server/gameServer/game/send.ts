import { GameState, PredictionState } from "../interfaces/stateInterface";
import { deepCopy } from "../util";

export const sendHand = (state: GameState) => {
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
}



export const sendState = (state: GameState) => {
    if (!state) {
        return;
    }
    state.agents.forEach(agent =>{
        agent.sendState(state) 
    })
}
/*
const stripCardForPred = (pred: PredictionState) => {
    return { prediction: pred.prediction, mechanics: pred.readiedEffects.map((reaEff) => reaEff.mechanic) }
}
*/