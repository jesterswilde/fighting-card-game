"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const effectHappens_1 = require("./effectHappens");
const errors_1 = require("../../errors");
const predictions_1 = require("./predictions");
const events_1 = require("../events");
const telegraph_1 = require("../checkMechanics/telegraph");
const reflex_1 = require("../checkMechanics/reflex");
const focus_1 = require("../checkMechanics/focus");
const readiedEffects_1 = require("../readiedEffects");
const handleStateEffects_1 = require("./handleStateEffects");
const collectDamage_1 = require("./collectDamage");
/*
    --- TODO ---
    if a telegraph adds a focus or some other effect that lives on the queue, that new effect should be
    it's own entity on the queue. This is not handled in any way currently.
    smimilarly, if the card is undefined, we don't handle this at all. Will crash.
*/
/*
    ++ NEW ORDER ++
    apply parry
    apply state effects
    check predictions
    add delayed effects (telegraphs, focus)
    apply damage -- Breaking this out will help possibly modify order later
    check for reflex
    check telegraph
    check focus
*/
exports.cardHappens = (state) => {
    try {
        //parry
        //collect damage
        events_1.storeEffectsForEvents(state);
        collectDamage_1.collectBlockAndDamage(state);
        handleStateEffects_1.applyStateEffects(state);
        exports.applyMechanics(state);
        events_1.storedEffectsToEvents(state);
        exports.removeStoredEffects(state);
        exports.checkPredictions(state);
        collectDamage_1.applyCollectedDamage(state);
        exports.checkForVictor(state);
        reflex_1.checkReflex(state);
        telegraph_1.checkTelegraph(state);
        focus_1.checkFocus(state);
    }
    catch (err) {
        if (err === errors_1.ControlEnum.NEW_EFFECTS) {
            console.log("New effects were found");
            exports.cardHappens(state);
        }
        else {
            throw (err);
        }
    }
};
exports.applyMechanics = (state) => {
    state.readiedEffects.forEach((playerEffects) => {
        effectHappens_1.reduceMechanics(playerEffects, state);
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
                const readied = readiedEffects_1.mechanicsToReadiedEffects(pred.mechanics, pred.card, state);
                readiedEffects_1.addReadiedToState(readied, state);
            }
        });
        state.pendingPredictions = undefined;
    }
    if (stateChanged) {
        throw errors_1.ControlEnum.NEW_EFFECTS;
    }
};
