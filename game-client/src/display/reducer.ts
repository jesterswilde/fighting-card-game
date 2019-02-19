import { DisplayState, ScreenEnum } from "./interface";
import { ActionType } from "../state/actionTypes";
import { DisplayActionEnum } from "./actions";
import { GameActionEnum } from "../game/actions";
import { LobbyActionEnum } from "../lobby/actions";

export const displayReducer = (state: DisplayState = {
    url: location.pathname,
    screen: ScreenEnum.CONNECTING
}, action: ActionType): DisplayState => {
    switch (action.type) {
        case DisplayActionEnum.SWITCH_SCREEN:
            return { ...state, screen: action.screen }
        case LobbyActionEnum.GOT_DECK_CHOICES:
            return { ...state, screen: ScreenEnum.CHOOSE_DECK }
        case GameActionEnum.START_GAME:
            return { ...state, screen: ScreenEnum.GAME_STARTED }
        default:
            return state
    }
}