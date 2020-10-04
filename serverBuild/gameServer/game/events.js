"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gameEvent_1 = require("../interfaces/gameEvent");
exports.newCardEvent = (state) => {
    startNewEvent(gameEvent_1.EventType.PLAYED_CARD, state);
    state.pickedCards.forEach((card, i) => {
        state.currentEvent[i].card = {
            cardName: card.name,
            priority: card.priority
        };
    });
};
exports.reflexEvent = (reflexingCards, state) => {
    startNewEvent(gameEvent_1.EventType.REFLEX, state);
    state.currentEvent.forEach((e, i) => {
        e.reflexingCard = reflexingCards[i];
    });
};
exports.predictionRevealEvent = (predictions, state) => {
    startNewEvent(gameEvent_1.EventType.REVEAL_PREDICTION, state);
    predictions.forEach((pred, i) => {
        if (!pred)
            return;
        state.currentEvent[i].prediction = pred;
    });
};
exports.gameOverEvent = (state) => {
    startNewEvent(gameEvent_1.EventType.GAME_OVER, state);
    state.currentEvent.forEach(e => e.winner = state.winner);
};
const startNewEvent = (header, state) => {
    if (state.currentEvent)
        state.events.push(state.currentEvent);
    state.currentEvent = state.agents.map(_ => ({
        type: header
    }));
};
exports.makeEventsFromReadied = (state) => {
    state.readiedEffects.forEach((reaEffArr, index) => {
        var events = reaEffArr
            .filter(reaEff => {
            const result = !reaEff.eventsHaveProcessed;
            reaEff.eventsHaveProcessed = true;
            return result;
        })
            .map(({ effect, happensTo }) => ({ effect, happensTo }));
        state.currentEvent[index].effects = [...state.currentEvent[index].effects, ...events];
    });
};
exports.sendEvents = (state) => {
    if (state.currentEvent != null) {
        state.events.push(state.currentEvent);
        state.currentEvent = null;
    }
    state.agents.forEach(agent => agent.sendEvents(state.events));
};
