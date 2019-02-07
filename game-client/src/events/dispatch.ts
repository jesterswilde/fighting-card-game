import { EventAction } from "./interface";
import { store } from "../state/store";
import { GotEventsAction, EventActionEnum, FinishedDisplayingEventsAction } from "./actions";

export const dispatchGotEvents = (events: EventAction[])=>{
    const action: GotEventsAction = {
        type: EventActionEnum.GOT_EVENTS,
        events
    }
    store.dispatch(action)
}

export const dispatchFinishedDisplayingEvents = ()=>{
    const action: FinishedDisplayingEventsAction = {
        type: EventActionEnum.FINISHED_DISPLAYING_EVENTS
    }
    store.dispatch(action); 
}