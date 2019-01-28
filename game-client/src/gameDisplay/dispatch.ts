import { ShouldPredictAction, GameDisplayActionEnum } from "./actions";
import { store } from "../state/store";

export const dispatchShouldPredict = ()=>{
    const action: ShouldPredictAction = {
        type: GameDisplayActionEnum.SHOULD_PREDICT
    }
    store.dispatch(action); 
}