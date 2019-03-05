import { Mechanic } from "../../shared/card";
import { PredictionEnum, HappensEnum } from "./stateInterface";

export enum EventTypeEnum{
    CARD_NAME,
    EFFECT,
    MECHANIC, 
    ADDED_MECHANIC,
    REVEAL_PREDICTION,
    GAME_OVER,
    MULTIPLE,
    EVENT_SECTION,
    CARD_NAME_SECTION
}

export interface EventAction{
    type: EventTypeEnum,
    events?: EventAction[]
    effect?: Mechanic,
    cardName?: string,
    priority?: number,
    mechanicName?: string,
    playedBy?: number,
    correct?: boolean,
    prediction?: PredictionEnum,
    correctGuesses?: PredictionEnum[],
    winner?: number,
    happenedTo?: HappensEnum[]
}

