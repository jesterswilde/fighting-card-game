import { Mechanic } from "../shared/card";
import { PredictionEnum } from "../game/interface";

export const EVENT_PLAY_SPEED = 500; 
export const EVENT_REPLAY_SPEED = 200; 

export interface EventState{
    events: EventAction[]
    isDisplaying: boolean
    history: EventAction[][]
    playSpeed?: number
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