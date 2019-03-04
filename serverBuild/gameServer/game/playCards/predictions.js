"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stateInterface_1 = require("../../interfaces/stateInterface");
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
