import { GameState } from "../interfaces/stateInterface";
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
        predictions: state.pendingPredictions,
        turnNumber: state.turnNumber
    }
    state.sockets.forEach((socket, i) => {
        const stateToSend = deepCopy(sendState) as GameState; 
        if(stateToSend.predictions){
            stateToSend.predictions.forEach((pred)=>{
                if(pred.card.player !== i){
                    pred.prediction = null; 
                }
            })
        }
        socket.emit(SocketEnum.GOT_STATE, stateToSend);
    })
}
