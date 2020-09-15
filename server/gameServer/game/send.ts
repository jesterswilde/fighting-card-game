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
    /*
    const sendState = {
        playerStates: state.playerStates,
        stateDurations: state.stateDurations,
        block: state.block,
        queue: state.queue,
        distance: state.distance,
        health: state.health,
        damaged: state.damaged,
        predictions: state.predictions.map((pred) => stripCardForPred(pred)),
        turnNumber: state.turnNumber
    }
    state.agents.forEach((agent, player) => {
        const stateToSend = deepCopy(sendState);
        if (stateToSend.predictions[player]) {
            stateToSend.predictions[player].prediction = null;
        }
        agent.sendState(stateToSend); 
    })
    */

}
/*
const stripCardForPred = (pred: PredictionState) => {
    return { prediction: pred.prediction, mechanics: pred.readiedEffects.map((reaEff) => reaEff.mechanic) }
}
*/