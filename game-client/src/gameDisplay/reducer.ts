import { GameDisplayState, GameDisplayEnum } from "./interface";
import { ActionType } from "../state/actionTypes";
import { GameActionEnum } from "../game/actions";
import { GameDisplayActionEnum } from "./actions";

export const gameDisplayReducer = (state: GameDisplayState = {showFullCard: false, screen: GameDisplayEnum.NORMAL}, action: ActionType): GameDisplayState=>{
    switch (action.type){
        case GameActionEnum.MADE_PREDICTION:
            return {...state, screen: GameDisplayEnum.NORMAL}
        case GameDisplayActionEnum.SHOULD_PREDICT:
            return {...state, screen: GameDisplayEnum.PREDICT}
        case GameDisplayActionEnum.SET_HAND_CARD_DISPLAY:
            return {...state, showFullCard: action.value}
        default:
            return state; 
    }
}