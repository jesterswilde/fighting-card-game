"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cardInterface_1 = require("../interfaces/cardInterface");
const gameEvent_1 = require("../interfaces/gameEvent");
const socket_1 = require("../interfaces/socket");
exports.addEffectEvent = (mechanic, playedBy, state) => {
    if (mechanic.mechanic === undefined || addableMechanics[mechanic.mechanic]) {
        state.events.push({ effect: mechanic, type: gameEvent_1.EventTypeEnum.EFFECT, playedBy });
    }
};
exports.addMechanicEvent = (mecheEnum, card, state) => {
    state.events.push({ type: gameEvent_1.EventTypeEnum.MECHANIC, mechanicName: mecheEnum, cardName: card.name, playedBy: card.player });
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
const addableMechanics = {
    [cardInterface_1.MechanicEnum.BLOCK]: true,
    [cardInterface_1.MechanicEnum.CRIPPLE]: true,
    [cardInterface_1.MechanicEnum.LOCK]: true
};
