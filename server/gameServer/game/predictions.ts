import { GameState, PredictionState, PredictionEnum } from "../interfaces/stateInterface";

export const didPredictionHappen = (prediction: PredictionState, state: GameState): boolean=>{
    switch(prediction.prediction){
        case(PredictionEnum.BALANCE):
            return state.modifiedAxis.balance;
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