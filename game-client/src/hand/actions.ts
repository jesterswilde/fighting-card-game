import { Card } from "../interfaces/card";

export enum HandActionEnum {
    PICKED_CARD = 'pickCard',
    GOT_CARDS = 'gotCards'
}

export interface PickedCardAction{
    type: HandActionEnum.PICKED_CARD
    index: number
}

export interface GotCardsAction{
    type: HandActionEnum.GOT_CARDS,
    cards: Card[]
}

export type HandActions = PickedCardAction | GotCardsAction; 