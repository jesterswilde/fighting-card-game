import { Mechanic } from "../interfaces/card";

export interface EventState{
    events: EventAction[]
    isDisplaying: boolean
}

export enum EventTypeEnum{
    CARD_NAME,
    EFFECT,
    MECHANIC
}

export interface EventAction{
    type: EventTypeEnum,
    effect?: Mechanic,
    cardName?: string,
    mechanicName?: string,
    playedBy: number
}