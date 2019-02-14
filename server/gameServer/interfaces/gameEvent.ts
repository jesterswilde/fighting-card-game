import { Mechanic } from "./cardInterface";
import { PredictionEnum } from "./stateInterface";

export enum EventTypeEnum{
    CARD_NAME,
    EFFECT,
    MECHANIC, 
    ADDED_MECHANIC,
    REVEAL_PREDICTION
}

export interface EventAction{
    type: EventTypeEnum,
    effect?: Mechanic,
    cardName?: string,
    mechanicName?: string,
    playedBy: number,
    correct?: boolean,
    prediction?: PredictionEnum,
    correctGuesses?: PredictionEnum[],
}