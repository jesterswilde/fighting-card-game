"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stateInterface_1 = require("../../interfaces/stateInterface");
const events_1 = require("../events");
const readiedEffects_1 = require("../readiedEffects");
const errors_1 = require("../../errors");
exports.didPredictionHappen = (prediction, state) => {
    switch (prediction.prediction) {
        case (stateInterface_1.PredictionEnum.DISTANCE):
            return state.modifiedAxis.distance;
        case (stateInterface_1.PredictionEnum.MOTION):
            return state.modifiedAxis.motion;
        case (stateInterface_1.PredictionEnum.STANDING):
            return state.modifiedAxis.standing;
        case (stateInterface_1.PredictionEnum.NONE):
            return !state.modifiedAxis.balance && !state.modifiedAxis.distance
                && !state.modifiedAxis.motion && !state.modifiedAxis.standing;
    }
    return false;
};
exports.checkPredictions = (state) => {
    const { predictions } = state;
    let stateChanged = false;
    predictions.forEach((pred, player) => {
        const didHappen = exports.didPredictionHappen(pred, state);
        events_1.addRevealPredictionEvent(didHappen, pred.prediction, player, state);
        if (didHappen) {
            stateChanged = true;
            readiedEffects_1.addReadiedToState(pred.readiedEffects, state);
        }
    });
    state.predictions = [];
    if (stateChanged) {
        throw errors_1.ControlEnum.NEW_EFFECTS;
    }
};
