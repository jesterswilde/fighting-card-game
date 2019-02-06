"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_1 = require("../interfaces/socket");
const util_1 = require("../util");
exports.sendHand = (state) => {
    const { sockets, currentPlayer: player, hands } = state;
    sockets[player].emit(socket_1.SocketEnum.GOT_CARDS, hands[player]);
};
exports.sendState = (state) => {
    if (!state) {
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
        predictions: state.pendingPredictions
    };
    state.sockets.forEach((socket, i) => {
        const stateToSend = util_1.deepCopy(sendState);
        if (stateToSend.predictions) {
            stateToSend.predictions.forEach((pred) => {
                if (pred.card.player !== i) {
                    pred.prediction = null;
                }
            });
        }
        socket.emit(socket_1.SocketEnum.GOT_STATE, stateToSend);
    });
};
