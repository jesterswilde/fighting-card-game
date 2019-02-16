"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cardInterface_1 = require("../interfaces/cardInterface");
const stateInterface_1 = require("../interfaces/stateInterface");
const gameEvent_1 = require("../interfaces/gameEvent");
const socket_1 = require("../interfaces/socket");
exports.addEffectEvent = (mechanic, playedBy, state) => {
    if (mechanic.mechanic === undefined || addableMechanics[mechanic.mechanic]) {
        state.events.push({ effect: mechanic, type: gameEvent_1.EventTypeEnum.EFFECT, playedBy });
    }
    else {
        if (!ignoredMechanics[mechanic.mechanic]) {
            exports.addedMechanicEvent(mechanic.mechanic, playedBy, state);
        }
    }
};
exports.addMechanicEvent = (mechEnum, card, state) => {
    state.events.push({ type: gameEvent_1.EventTypeEnum.MECHANIC, mechanicName: mechEnum, cardName: card.name, playedBy: card.player });
};
exports.addGameOverEvent = (winner, state) => {
    state.events.unshift({ type: gameEvent_1.EventTypeEnum.GAME_OVER, winner });
};
exports.addedMechanicEvent = (mechEnum, playedBy, state) => {
    state.events.push({ type: gameEvent_1.EventTypeEnum.ADDED_MECHANIC, mechanicName: mechEnum, playedBy });
};
exports.addRevealPredictionEvent = (correct, prediction, card, state) => {
    const correctGuesses = [];
    if (state.modifiedAxis.distance)
        correctGuesses.push(stateInterface_1.PredictionEnum.DISTANCE);
    if (state.modifiedAxis.motion)
        correctGuesses.push(stateInterface_1.PredictionEnum.MOTION);
    if (state.modifiedAxis.standing)
        correctGuesses.push(stateInterface_1.PredictionEnum.STANDING);
    if (correctGuesses.length === 0)
        correctGuesses.push(stateInterface_1.PredictionEnum.NONE);
    state.events.push({ type: gameEvent_1.EventTypeEnum.REVEAL_PREDICTION, correct, prediction, correctGuesses, cardName: card.name, playedBy: card.player });
};
exports.addCardEvent = (card, state) => {
    state.events.push({ type: gameEvent_1.EventTypeEnum.CARD_NAME, playedBy: card.player, cardName: card.name });
};
exports.sendEvents = (state) => {
    state.sockets.forEach((socket) => {
        socket.emit(socket_1.SocketEnum.GOT_EVENTS, state.events);
    });
    state.events = [];
};
//These are ignored because they are handled later.
const ignoredMechanics = {
    [cardInterface_1.MechanicEnum.REFLEX]: true,
};
//They have their own printed versions
const addableMechanics = {
    [cardInterface_1.MechanicEnum.BLOCK]: true,
    [cardInterface_1.MechanicEnum.CRIPPLE]: true,
    [cardInterface_1.MechanicEnum.LOCK]: true,
    [cardInterface_1.MechanicEnum.FORCEFUL]: true,
};
