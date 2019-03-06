import { GameState, PredictionState } from "../interfaces/stateInterface";
import { SocketEnum } from "../../shared/socket";
import { deepCopy, getOpponent } from "../util";

export const sendHand = (state: GameState) => {
    const { sockets, hands } = state;
    const handSizes = hands.map((hand)=> hand.length); 
    sockets.forEach((socket, player)=>{
        sockets[player].emit(SocketEnum.GOT_CARDS, {hand:hands[player], handSizes});
    }) 
}


export const sendState = (state: GameState) => {
    if(!state){
        return;
    }
    const sendState = {
        playerStates: state.playerStates,
        stateDurations: state.stateDurations,
        block: state.parry,
        queue: state.queue,
        distance: state.distance,
        health: state.health,
        damaged: state.damaged,
        predictions: state.predictions.map((pred)=> stripCardForPred(pred)),
        turnNumber: state.turnNumber
    }
    state.sockets.forEach((socket, player) => {
        const stateToSend = deepCopy(sendState); 
        if(stateToSend.predictions[player]){
            stateToSend.predictions[player].prediction = null; 
        }
        socket.emit(SocketEnum.GOT_STATE, stateToSend);
    })
}

const stripCardForPred = (pred: PredictionState)=>{
    return {prediction: pred.prediction, mechanics: pred.readiedEffects.map((reaEff)=> reaEff.mechanic)}
}