import { Card } from "../shared/card";

export enum HandActionEnum {
    PICKED_CARD = 'pickCard',
    GOT_CARDS = 'gotCards',
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

export interface GotCardsAction{
    type: HandActionEnum.GOT_CARDS,
    cards: Card[]
}

export type HandActions = PickedCardAction | GotCardsAction | OppGotCardsAction | OppPickedCardAction; 