"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const effectReducer_1 = require("./effectReducer");
const errors_1 = require("../errors");
const predictions_1 = require("./predictions");
const events_1 = require("./events");
const telegraph_1 = require("./checkMechanics/telegraph");
const reflex_1 = require("./checkMechanics/reflex");
const focus_1 = require("./checkMechanics/focus");
const readiedEffects_1 = require("./readiedEffects");
/*
    --- TODO ---
    if a telegraph adds a focus or some other effect that lives on the queue, that new effect should be
    it's own entity on the queue. This is not handled in any way currently.
    smimilarly, if the card is undefined, we don't handle this at all. Will crash.
*/
exports.applyEffects = (state) => {
    try {
        console.log("Starting to apply effects");
        exports.makeEffectsReduceable(state);
        console.log("removing stored effects");
        exports.removeStoredEffects(state);
        exports.checkForVictor(state);
        console.log("Checking predictions");
        exports.checkPredictions(state);
        console.log("checking telegraph");
        telegraph_1.checkTelegraph(state);
        console.log("checking reflex");
        reflex_1.checkReflex(state);
        console.log("checking focus");
        focus_1.checkFocus(state);
    }
    catch (err) {
        if (err === errors_1.ControlEnum.NEW_EFFECTS) {
            console.log("New effects were found");
            exports.applyEffects(state);
        }
        else {
            throw (err);
        }
    }
};
exports.makeEffectsReduceable = (state) => {
    state.readiedEffects.forEach((playerEffects) => {
        effectReducer_1.reduceMechanics(playerEffects, state);
    });
};
exports.removeStoredEffects = (state) => {
    state.readiedEffects = state.readiedEffects.map(() => []);
};
exports.checkForVictor = (state) => {
    const { health } = state;
    if (health.every((hp) => hp <= 0)) {
        state.winner = -1;
    }
    else if (health[0] <= 0) {
        state.winner = 1;
    }
    else if (health[1] <= 0) {
        state.winner = 0;
    }
    if (state.winner !== undefined) {
        throw errors_1.ControlEnum.GAME_OVER;
    }
};
exports.checkPredictions = (state) => {
    const { pendingPredictions: predictions } = state;
    let stateChanged = false;
    if (predictions) {
        predictions.forEach((pred) => {
            const didHappen = predictions_1.didPredictionHappen(pred, state);
            events_1.addRevealPredictionEvent(didHappen, pred.prediction, pred.card, state);
            if (didHappen) {
                stateChanged = true;
                const readied = readiedEffects_1.mechanicsToReadiedEffects(pred.mechanics, pred.card);
                readiedEffects_1.addReadiedToState(readied, state);
            }
        });
        state.pendingPredictions = undefined;
    }
    if (stateChanged) {
        throw errors_1.ControlEnum.NEW_EFFECTS;
    }
};
