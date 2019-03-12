import { GameState, PredictionState, PredictionEnum } from "../../interfaces/stateInterface";
import { addRevealPredictionEvent } from "../events";
import { addReadiedToState } from "../readiedEffects";
import { ControlEnum } from "../../errors";

export const didPredictionHappen = (prediction: PredictionState, state: GameState): boolean=>{
    switch(prediction.prediction){
        case(PredictionEnum.DISTANCE):
            return state.modifiedAxis.distance;
        case(PredictionEnum.MOTION):
            return state.modifiedAxis.motion; 
        case(PredictionEnum.STANDING):
            return state.modifiedAxis.standing;
        case(PredictionEnum.NONE):
            return !state.modifiedAxis.balance && !state.modifiedAxis.distance 
                && !state.modifiedAxis.motion && !state.modifiedAxis.standing; 
    }
    return false; 
}

export const checkPredictions = (state: GameState) => {
    const { predictions } = state;
    let stateChanged = false;
    predictions.forEach((pred, player) => {
        const didHappen = didPredictionHappen(pred, state)
        addRevealPredictionEvent(didHappen, pred.prediction, player, state);
        if (didHappen) {
            stateChanged = true;
            addReadiedToState(pred.readiedEffects, state);
        }
    })
    state.predictions = [];
    if (stateChanged) {
        throw ControlEnum.NEW_EFFECTS;
    }
}