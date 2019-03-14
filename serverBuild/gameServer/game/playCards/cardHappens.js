"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const effectHappens_1 = require("./effectHappens");
const errors_1 = require("../../errors");
const events_1 = require("../events");
const telegraph_1 = require("../checkMechanics/telegraph");
const reflex_1 = require("../checkMechanics/reflex");
const focus_1 = require("../checkMechanics/focus");
const handleStateEffects_1 = require("./handleStateEffects");
const collectDamage_1 = require("./collectDamage");
const predictions_1 = require("./predictions");
const util_1 = require("../../util");
const card_1 = require("../../../shared/card");
const priority_1 = require("../checkMechanics/priority");
exports.cardHappens = (state) => {
    try {
        events_1.storeEffectsForEvents(state);
        collectDamage_1.collectBlockAndDamage(state);
        priority_1.applyClutch(state);
        exports.applyPoise(state);
        handleStateEffects_1.applyStateEffects(state);
        exports.applyMechanics(state);
        events_1.processPlayedCardEvents(state);
        events_1.processEffectEvents(state);
        exports.removeStoredEffects(state);
        predictions_1.checkPredictions(state);
        reflex_1.checkReflex(state);
        telegraph_1.checkTelegraph(state);
        focus_1.checkFocus(state);
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
exports.applyPoise = (state) => {
    state.readiedEffects = state.readiedEffects.map((playerReaEffs, player) => {
        const [poiseArr, unusedArr] = util_1.splitArray(playerReaEffs, ({ mechanic }) => mechanic.axis === card_1.AxisEnum.POISE || mechanic.axis === card_1.AxisEnum.LOSE_POISE);
        poiseArr.forEach((reaEff) => {
            effectHappens_1.reduceStateChangeReaEff(reaEff, state);
        });
        return unusedArr;
    });
};
