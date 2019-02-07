import { Mechanic } from "./cardInterface";

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