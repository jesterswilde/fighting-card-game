import { Mechanic } from "../interfaces/card";
import { PredictionEnum } from "../game/interface";

export interface EventState{
    events: EventAction[]
    isDisplaying: boolean
}
export enum EventTypeEnum{
    CARD_NAME,
    EFFECT,
    MECHANIC, 
    ADDED_MECHANIC,
    REVEAL_PREDICTION,
    GAME_OVER
}

export interface EventAction{
    type: EventTypeEnum,
    effect?: Mechanic,
    cardName?: string,
    mechanicName?: string,
    playedBy?: number,
    correct?: boolean,
    prediction?: PredictionEnum,
    correctGuesses?: PredictionEnum[],
    winner?: number
}