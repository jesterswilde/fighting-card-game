import { GameState } from "../interfaces/stateInterface";
import { SocketEnum } from "../../shared/socket";
import { deepCopy, getOpponent } from "../util";

export const sendHand = (state: GameState) => {
    const { sockets, currentPlayer: player, hands } = state;
    const numCards = hands[player].length;
    const opponent = getOpponent(player); 
    sockets[player].emit(SocketEnum.GOT_CARDS, hands[player]);
    sockets[opponent].emit(SocketEnum.OPPONENT_GOT_CARDS, numCards); 
}


export const sendState = (state: GameState) => {
    if(!state){
        return;
    }
    const sendState = {
        playerStates: state.playerStates,
        stateDurations: state.stateDurations,
        block: state.block,
        queue: state.queue,
        distance: state.distance,
        currentPlayer: state.currentPlayer,
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
