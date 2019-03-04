import { Card } from "../shared/card";
import { HandState } from "./interface";

export enum HandActionEnum {
    PICKED_CARD = 'pickCard',
    GOT_HAND_STATE = 'gotHandState',
    OPPONENT_GOT_CARDS = 'opponentGotCards',
    OPPONENT_PICKED_CARD = 'opponentPickedCard'
}

export interface OppGotCardsAction{
    type: HandActionEnum.OPPONENT_GOT_CARDS,
    cards: number
}

export interface OppPickedCardAction{
    type: HandActionEnum.OPPONENT_PICKED_CARD,
}

export interface PickedCardAction{
    type: HandActionEnum.PICKED_CARD
    index: number
}

export interface GotHandStateAction{
    type: HandActionEnum.GOT_HAND_STATE,
    handState: HandState
}

export type HandActions = PickedCardAction | GotHandStateAction | OppGotCardsAction | OppPickedCardAction; 