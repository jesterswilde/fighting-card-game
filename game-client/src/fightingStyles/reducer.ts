import { FightingStyleState } from "./interface";
import { ActionType } from "../state/actionTypes";
import { FightingStyleEnum } from "./actions";

export const fightingStyleReducer = (state: FightingStyleState = makeDefaultState(), action: ActionType): FightingStyleState => {
    switch (action.type) {
        case FightingStyleEnum.GOT_STYLE:
            return { ...state, loadingStyle: false, style: action.style }
        case FightingStyleEnum.GOT_STYLE_NAMES:
            return { ...state, loadingStyleNames: false, styleDescriptions: action.styleDescriptions }
        case FightingStyleEnum.LOADING_STYLE:
            return { ...state, loadingStyle: true }
        case FightingStyleEnum.LOADING_STYLE_NAMES:
            return { ...state, loadingStyleNames: true }
        default:
            return state;
    }
}

const makeDefaultState = (): FightingStyleState => {
    return {
        style: null,
        styleDescriptions: [],
        loadingStyle: false,
        loadingStyleNames: false,
    }
}