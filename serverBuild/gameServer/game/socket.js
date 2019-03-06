"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_1 = require("../../shared/socket");
const util_1 = require("../util");
exports.sendHand = (state) => {
    const { sockets, hands } = state;
    const handSizes = hands.map((hand) => hand.length);
    sockets.forEach((socket, player) => {
        sockets[player].emit(socket_1.SocketEnum.GOT_CARDS, { hand: hands[player], handSizes });
    });
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
        health: state.health,
        damaged: state.damaged,
        predictions: state.predictions.map((pred) => stripCardForPred(pred)),
        turnNumber: state.turnNumber
    };
    state.sockets.forEach((socket, player) => {
        const stateToSend = util_1.deepCopy(sendState);
        if (stateToSend.predictions[player]) {
            stateToSend.predictions[player].prediction = null;
        }
        socket.emit(socket_1.SocketEnum.GOT_STATE, stateToSend);
    });
};
const stripCardForPred = (pred) => {
    return { prediction: pred.prediction, mechanics: pred.readiedEffects.map((reaEff) => reaEff.mechanic) };
};
