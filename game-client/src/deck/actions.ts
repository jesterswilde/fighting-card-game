import { DeckChoice } from "./interfaces";

export enum DeckActionEnum{
    GOT_DECK_CHOICES = 'gotDeckChoices',
    PICKED_DECK = 'pickedDeck'
}


export interface GotDeckChoicesAction{
    type: DeckActionEnum.GOT_DECK_CHOICES,
    choices: DeckChoice[]
}

export interface PickedDeckAction{
    type: DeckActionEnum.PICKED_DECK,
    choice: number
}

export type DeckActions =  GotDeckChoicesAction | PickedDeckAction;