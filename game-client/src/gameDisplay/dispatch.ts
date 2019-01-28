import { ShouldPredictAction, GameDisplayActionEnum, SetHandCardDisplayAction } from "./actions";
import { store } from "../state/store";

export const dispatchShouldPredict = ()=>{
    const action: ShouldPredictAction = {
        type: GameDisplayActionEnum.SHOULD_PREDICT
    }
    store.dispatch(action); 
}

export const dispatchSetHandCardDisplay = (value: boolean)=>{
    const action: SetHandCardDisplayAction = {
        type: GameDisplayActionEnum.SET_HAND_CARD_DISPLAY,
        value
    }
    store.dispatch(action); 
}