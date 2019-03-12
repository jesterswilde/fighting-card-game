import { GameState, PredictionState } from "../interfaces/stateInterface";
import { SocketEnum } from "../../shared/socket";
import { deepCopy, getOpponent } from "../util";

export const sendHand = (state: GameState) => {
    const { sockets, hands } = state;

    sockets.forEach((socket, currentPlayer) => {
        socket.emit(SocketEnum.GOT_CARDS, {
            hands: hands.map((hand, player) => {
                if (player === currentPlayer) {
                    return hand;
                }
                return hand.map((card) => card.isFaceUp ? card : null);
            })
        });
    })
}


export const sendState = (state: GameState) => {
    if (!state) {
        return;
    }
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
    state.sockets.forEach((socket, player) => {
        const stateToSend = deepCopy(sendState);
        if (stateToSend.predictions[player]) {
            stateToSend.predictions[player].prediction = null;
        }
        socket.emit(SocketEnum.GOT_STATE, stateToSend);
    })
}

const stripCardForPred = (pred: PredictionState) => {
    return { prediction: pred.prediction, mechanics: pred.readiedEffects.map((reaEff) => reaEff.mechanic) }
}