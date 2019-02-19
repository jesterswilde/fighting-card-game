import { LobbyState } from "./interfaces";
import { ActionType } from "../state/actionTypes";
import { LobbyActionEnum } from "./actions";

export const lobbyReducer = (state: LobbyState = {}, action: ActionType): LobbyState => {
    switch (action.type) {
        case LobbyActionEnum.GOT_DECK_CHOICES:
            return { ...state, deckChoices: action.choices }
        case LobbyActionEnum.PICKED_DECK:
            const { deckChoices } = state;
            const { choice } = action;
            return { ...state, deckName: deckChoices[choice].name, deckChoices: undefined }
        default:
            return state
    }
}