import { EventState } from "./interface";
import { ActionType } from "../state/actionTypes";
import { EventActionEnum, GotEventsAction, DisplayEventHistoryAction } from "./actions";
import { QUEUE_LENGTH } from "../gameSettings";

export const eventReducer = (state: EventState = { isDisplaying: false, events: [], history: [] }, action: ActionType): EventState => {
    switch (action.type) {
        case EventActionEnum.GOT_EVENTS:
            return gotEventsReducer(state, action);
        case EventActionEnum.FINISHED_DISPLAYING_EVENTS:
            return { ...state, isDisplaying: false, events: [] };
        case EventActionEnum.DISPLAY_EVENT_HISTORY:
            return displayEventHistoryReducer(state, action);
        default:
            return state;
    }
}

const displayEventHistoryReducer = (state: EventState, { index }: DisplayEventHistoryAction): EventState => {
    let events = state.history[index];
    if (events) {
        events = [...events];
    } else {
        events = [];
    }
    return { ...state, isDisplaying: true, events };
}

const gotEventsReducer = (state: EventState, action: GotEventsAction): EventState => {
    let history = [action.events, ...state.history];
    history = history.slice(0, QUEUE_LENGTH);
    return { ...state, isDisplaying: true, events: action.events, history }
}