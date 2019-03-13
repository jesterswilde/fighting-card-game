"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = require("../../shared/card");
const gameEvent_1 = require("../interfaces/gameEvent");
const socket_1 = require("../../shared/socket");
const predictions_1 = require("./playCards/predictions");
exports.addReflexEffects = (players, state) => {
    let lastEvent = state.events[state.events.length - 1];
    players.forEach((cardName, playedBy) => {
        if (cardName && Array.isArray(lastEvent.events) && Array.isArray(lastEvent.events[playedBy].events)) {
            lastEvent.events[playedBy].events.push({ type: gameEvent_1.EventTypeEnum.MECHANIC, mechanicName: card_1.MechanicEnum.REFLEX, cardName, playedBy });
        }
    });
};
exports.storeEffectsForEvents = (state) => {
    state.pendingEvents = [...state.readiedEffects];
};
exports.processEffectEvents = (state) => {
    const events = state.pendingEvents.map((playerReaEff, player) => {
        const events = playerReaEff.map((reaEff) => reaEfftoEvent(reaEff));
        return { type: gameEvent_1.EventTypeEnum.MULTIPLE, events };
    });
    state.events.push({ type: gameEvent_1.EventTypeEnum.EVENT_SECTION, events });
    state.pendingEvents = undefined;
};
exports.storePlayedCardEvent = (player, state) => {
    const card = state.pickedCards[player];
    state.pendingCardEvents = state.pendingCardEvents || [];
    state.pendingCardEvents[player] = card;
};
exports.processPlayedCardEvents = (state) => {
    if (state.pendingCardEvents === undefined)
        return;
    const events = state.pendingCardEvents.map((card) => {
        if (card) {
            return { type: gameEvent_1.EventTypeEnum.CARD_NAME, priority: card.priority, cardName: card.name, playedBy: card.player };
        }
        return null;
    });
    state.events.push({ events, type: gameEvent_1.EventTypeEnum.CARD_NAME_SECTION });
    state.pendingCardEvents = undefined;
};
const reaEfftoEvent = (reaEff) => {
    const { mechanic: mech, isHappening, card, isEventOnly, happensTo } = reaEff;
    //These are for thigns like damage, block, and things that get printed in that format
    if (mech.mechanic === undefined || (addableMechanics[reaEff.mechanic.mechanic] && !reaEff.isHappening)) {
        return { type: gameEvent_1.EventTypeEnum.EFFECT, effect: reaEff.mechanic, playedBy: card.player, happenedTo: happensTo };
    } //This is for when a telegraph, reflex, or focus is actually triggered 
    else if (isHappening && isEventOnly) {
        return { type: gameEvent_1.EventTypeEnum.MECHANIC, mechanicName: mech.mechanic, cardName: card.name, playedBy: card.player };
    } //This is for when delayed mechanics are added, but have no current effect. 
    else if (!ignoredMechanics[mech.mechanic] || isEventOnly) {
        return { type: gameEvent_1.EventTypeEnum.ADDED_MECHANIC, mechanicName: mech.mechanic, playedBy: card.player };
    }
};
// export const stateReaEffEvent = (reaEffs: ReadiedEffect, state: GameState) => {
//     state.events.push({ type: EventTypeEnum.EFFECT, playedBy: reaEffs.card.player, effect: reaEffs.mechanic, happenedTo: reaEffs.happensTo });
// }
exports.addGameOverEvent = (winner, state) => {
    state.events.push({ type: gameEvent_1.EventTypeEnum.GAME_OVER, winner });
};
exports.addRevealPredictionEvent = (predEvents, state) => {
    const hasEvents = predEvents.some((a) => a !== undefined && a !== null);
    if (hasEvents) {
        const playerEvents = predEvents.map((predEvent, player) => {
            const correctGuesses = predictions_1.getCorrectGuessArray(predEvent.targetPlayer, state);
            return { type: gameEvent_1.EventTypeEnum.REVEAL_PREDICTION, correct: predEvent.didHappen, prediction: predEvent.prediction, correctGuesses };
        });
        state.events.push({ type: gameEvent_1.EventTypeEnum.PREDICTION_SECTION, events: playerEvents });
    }
};
exports.sendEvents = (state) => {
    state.sockets.forEach((socket) => {
        socket.emit(socket_1.SocketEnum.GOT_EVENTS, state.events);
    });
    state.events = [];
};
//These are ignored because they are handled later.
const ignoredMechanics = {
    [card_1.MechanicEnum.REFLEX]: true,
};
//They have their own printed versions
const addableMechanics = {
    [card_1.MechanicEnum.BLOCK]: true,
    [card_1.MechanicEnum.PARRY]: true,
    [card_1.MechanicEnum.CRIPPLE]: true,
    [card_1.MechanicEnum.LOCK]: true,
    [card_1.MechanicEnum.FORCEFUL]: true,
};
