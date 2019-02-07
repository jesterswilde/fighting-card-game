import { EventState } from "./interface";
import { ActionType } from "../state/actionTypes";
import { EventActionEnum } from "./actions";

export const eventReducer = (state: EventState = { isDisplaying: false, events: [] }, action: ActionType): EventState => {
    switch (action.type) {
        case EventActionEnum.GOT_EVENTS:
            return {...state, isDisplaying: true, events: action.events}
        case EventActionEnum.FINISHED_DISPLAYING_EVENTS:
            return {...state, isDisplaying: false, events: []}
        default:
            return state;
    }
}