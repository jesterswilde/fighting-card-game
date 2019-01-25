import { DecksState } from "./interfaces";
import { ActionType } from "../state/actionTypes";
import { DeckActionEnum } from "./actions";

export const deckReducer = (state: DecksState = {}, action: ActionType): DecksState => {
    switch (action.type) {
        case DeckActionEnum.GOT_DECK_CHOICES:
            return { ...state, deckChoices: action.choices }
        case DeckActionEnum.PICKED_DECK:
            const { deckChoices } = state;
            const { choice } = action;
            return { ...state, deckName: deckChoices[choice], deckChoices: undefined}
        default:
            return state
    }
}