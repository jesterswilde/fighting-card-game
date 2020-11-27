"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkForVictor = exports.clearReadiedEffectsAndMechanics = exports.cardHappens = void 0;
const handleComplexMech_1 = require("./handleComplexMech");
const errors_1 = require("../../errors");
const telegraph_1 = require("../mechanics/telegraph");
const reflex_1 = require("../mechanics/reflex");
const focus_1 = require("../mechanics/focus");
const handleStateEffects_1 = require("./handleStateEffects");
const handleDamage_1 = require("./handleDamage");
const clutch_1 = require("../mechanics/clutch");
const predict_1 = require("../mechanics/predict");
const handleSimpleMech_1 = require("./handleSimpleMech");
const poise_1 = require("../mechanics/poise");
exports.cardHappens = (state) => {
    try {
        handleDamage_1.collectBlockAndDamage(state);
        clutch_1.applyClutch(state);
        poise_1.applyPoise(state);
        handleComplexMech_1.applyComplexMech(state);
        handleSimpleMech_1.applySimpleMech(state);
        handleStateEffects_1.applyStateEffects(state);
        exports.clearReadiedEffectsAndMechanics(state);
        predict_1.checkPredictions(state);
        telegraph_1.checkTelegraph(state);
        focus_1.checkFocus(state);
        reflex_1.checkReflex(state);
        handleDamage_1.applyCollectedDamage(state);
        exports.checkForVictor(state);
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
exports.clearReadiedEffectsAndMechanics = (state) => {
    state.readiedEffects = state.readiedEffects.map(() => []);
    state.readiedMechanics = state.readiedMechanics.map(() => []);
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
