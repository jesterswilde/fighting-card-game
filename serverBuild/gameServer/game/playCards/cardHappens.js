"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const effectHappens_1 = require("./effectHappens");
const errors_1 = require("../../errors");
const telegraph_1 = require("../mechanics/telegraph");
const reflex_1 = require("../mechanics/reflex");
const focus_1 = require("../mechanics/focus");
const handleStateEffects_1 = require("./handleStateEffects");
const collectDamage_1 = require("./collectDamage");
const util_1 = require("../../util");
const card_1 = require("../../../shared/card");
const clutch_1 = require("../mechanics/clutch");
const predict_1 = require("../mechanics/predict");
exports.cardHappens = (state) => {
    try {
        collectDamage_1.collectBlockAndDamage(state);
        clutch_1.applyClutch(state);
        exports.applyPoise(state);
        exports.applyMechanics(state);
        handleStateEffects_1.applyStateEffects(state);
        exports.clearReadiedEffectsAndMechanics(state);
        predict_1.checkPredictions(state);
        telegraph_1.checkTelegraph(state);
        focus_1.checkFocus(state);
        reflex_1.checkReflex(state);
        collectDamage_1.applyCollectedDamage(state);
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
exports.applyMechanics = (state) => {
    state.readiedMechanics.forEach((reaMech) => {
        effectHappens_1.handleReadiedMechanics(reaMech, state);
    });
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
exports.applyPoise = (state) => {
    state.readiedEffects = state.readiedEffects.map((playerReaEffs, player) => {
        const [poiseArr, unusedArr] = util_1.splitArray(playerReaEffs, ({ effect }) => effect.axis === card_1.AxisEnum.POISE || effect.axis === card_1.AxisEnum.LOSE_POISE);
        poiseArr.forEach((reaEff) => {
            effectHappens_1.handleReadiedEffects(reaEff, state);
        });
        return unusedArr;
    });
};
