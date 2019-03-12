"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stateInterface_1 = require("../../interfaces/stateInterface");
const events_1 = require("../events");
const readiedEffects_1 = require("../readiedEffects");
const errors_1 = require("../../errors");
const card_1 = require("../../../shared/card");
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
    const predEvents = predictions.map((pred, player) => {
        const didHappen = exports.didPredictionHappen(pred, state);
        if (didHappen) {
            stateChanged = true;
            readiedEffects_1.addReadiedToState(pred.readiedEffects, state);
        }
        return { didHappen, prediction: pred.prediction, player };
    });
    events_1.addRevealPredictionEvent(predEvents, state);
    state.predictions = [];
    if (stateChanged) {
        throw errors_1.ControlEnum.NEW_EFFECTS;
    }
};
const markAxisChange = (mechanic, card, state) => {
    const { player } = card;
    const axisObj = state.modifiedAxis[player];
    switch (mechanic.axis) {
        case card_1.AxisEnum.MOVING:
        case card_1.AxisEnum.STILL:
            axisObj.motion = true;
            break;
        case card_1.AxisEnum.STANDING:
        case card_1.AxisEnum.PRONE:
            axisObj.standing = true;
            break;
        case card_1.AxisEnum.CLOSE:
        case card_1.AxisEnum.CLOSER:
        case card_1.AxisEnum.GRAPPLED:
        case card_1.AxisEnum.FAR:
        case card_1.AxisEnum.FURTHER:
            axisObj.distance = true;
            break;
    }
};
exports.markAxisChanges = (state) => {
    if (state.readiedEffects) {
        state.readiedEffects.forEach((playerEffect = []) => {
            playerEffect.forEach(({ mechanic, card }) => {
                markAxisChange(mechanic, card, state);
            });
        });
    }
};
