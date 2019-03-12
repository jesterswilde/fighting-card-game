import { GameState, PredictionState, PredictionEnum, PredictionEvent } from "../../interfaces/stateInterface";
import { addRevealPredictionEvent } from "../events";
import { addReadiedToState } from "../readiedEffects";
import { ControlEnum } from "../../errors";
import { Mechanic, Card, AxisEnum } from "../../../shared/card";

export const didPredictionHappen = (prediction: PredictionState, state: GameState): boolean => {
    switch (prediction.prediction) {
        case (PredictionEnum.DISTANCE):
            return state.modifiedAxis.distance;
        case (PredictionEnum.MOTION):
            return state.modifiedAxis.motion;
        case (PredictionEnum.STANDING):
            return state.modifiedAxis.standing;
        case (PredictionEnum.NONE):
            return !state.modifiedAxis.balance && !state.modifiedAxis.distance
                && !state.modifiedAxis.motion && !state.modifiedAxis.standing;
    }
    return false;
}

export const checkPredictions = (state: GameState) => {
    const { predictions } = state;
    let stateChanged = false;
    const predEvents: PredictionEvent[] = predictions.map((pred, player) => {
        const didHappen = didPredictionHappen(pred, state)
        if (didHappen) {
            stateChanged = true;
            addReadiedToState(pred.readiedEffects, state);
        }
        return { didHappen, prediction: pred.prediction, player };
    })
    addRevealPredictionEvent(predEvents, state);
    state.predictions = [];
    if (stateChanged) {
        throw ControlEnum.NEW_EFFECTS;
    }
}


const markAxisChange = (mechanic: Mechanic, card: Card, state: GameState) => {
    const { player } = card;
    const axisObj = state.modifiedAxis[player];
    switch (mechanic.axis) {
        case AxisEnum.MOVING:
        case AxisEnum.STILL:
            axisObj.motion = true;
            break;
        case AxisEnum.STANDING:
        case AxisEnum.PRONE:
            axisObj.standing = true;
            break;
        case AxisEnum.CLOSE:
        case AxisEnum.CLOSER:
        case AxisEnum.GRAPPLED:
        case AxisEnum.FAR:
        case AxisEnum.FURTHER:
            axisObj.distance = true;
            break;
    }
}

export const markAxisChanges = (state: GameState) => {
    if (state.readiedEffects) {
        state.readiedEffects.forEach((playerEffect = []) => {
            playerEffect.forEach(({ mechanic, card }) => {
                markAxisChange(mechanic, card, state);
            })
        })
    }
}