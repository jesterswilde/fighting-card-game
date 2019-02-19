import { DeckChoice } from "./interfaces";

export enum LobbyActionEnum{
    GOT_DECK_CHOICES = 'gotDeckChoices',
    PICKED_DECK = 'pickedDeck'
}


export interface GotDeckChoicesAction{
    type: LobbyActionEnum.GOT_DECK_CHOICES,
    choices: DeckChoice[]
}

export interface PickedDeckAction{
    type: LobbyActionEnum.PICKED_DECK,
    choice: number
}

export type LobbyActions =  GotDeckChoicesAction | PickedDeckAction;