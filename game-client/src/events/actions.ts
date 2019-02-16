import { EventAction } from "./interface";

export enum EventActionEnum{
    GOT_EVENTS = 'gotEvents',
    FINISHED_DISPLAYING_EVENTS = 'finishedDisplayingEvents',
    DISPLAY_EVENT_HISTORY = 'displayEventHistory',
}

export interface DisplayEventHistoryAction{
    type: EventActionEnum.DISPLAY_EVENT_HISTORY,
    index: number
}

export interface GotEventsAction{
    type: EventActionEnum.GOT_EVENTS,
    events: EventAction[]
}

export interface FinishedDisplayingEventsAction{
    type: EventActionEnum.FINISHED_DISPLAYING_EVENTS
}

export type EventActions = GotEventsAction | FinishedDisplayingEventsAction | DisplayEventHistoryAction;