"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEvents = exports.makeEventsFromReadied = exports.addDisplayEvent = exports.startNewEvent = exports.gameOverEvent = exports.reflexEvent = exports.newCardEvent = void 0;
const gameEvent_1 = require("../interfaces/gameEvent");
exports.newCardEvent = (state) => {
    console.log("Adding new card event");
    exports.startNewEvent(gameEvent_1.EventType.PLAYED_CARD, state);
    state.pickedCards.forEach((card, i) => {
        if (!card)
            return null;
        state.currentEvent[i].card = {
            cardName: card.name,
            priority: card.priority,
        };
    });
};
exports.reflexEvent = (reflexingCards, state) => {
    exports.startNewEvent(gameEvent_1.EventType.REFLEX, state);
};
exports.gameOverEvent = (state) => {
    exports.startNewEvent(gameEvent_1.EventType.GAME_OVER, state);
    state.currentEvent.forEach((e) => (e.winner = state.winner));
};
exports.startNewEvent = (header, state) => {
    if (state.currentEvent)
        state.events.push(state.currentEvent);
    state.currentEvent = state.agents.map(() => ({
        type: header,
    }));
};
exports.addDisplayEvent = (display, index, state, addEvents = false) => {
    state.currentEvent[index].effects = state.currentEvent[index].effects || [];
    state.currentEvent[index].effects.push({ type: gameEvent_1.EventEffectType.CHOICE, display });
    if (addEvents)
        exports.makeEventsFromReadied(state);
};
exports.makeEventsFromReadied = (state) => {
    state.readiedEffects.forEach((reaEffArr, index) => {
        var events = reaEffArr
            .filter((reaEff) => {
            const result = !reaEff.eventsHaveProcessed;
            reaEff.eventsHaveProcessed = true;
            return result;
        })
            .map(({ effect, happensTo }) => ({ effect, happensTo, type: gameEvent_1.EventEffectType.EFFECT }));
        if (!state.currentEvent[index])
            throw new Error("No current event");
        state.currentEvent[index].effects = state.currentEvent[index].effects ?? [];
        state.currentEvent[index].effects.push(...events);
    });
};
exports.sendEvents = (state) => {
    if (state.currentEvent != null) {
        state.events.push(state.currentEvent);
        state.currentEvent = null;
    }
    state.agents.forEach((agent) => agent.sendEvents(state.events));
    state.events = [];
    state.currentEvent = null;
};
