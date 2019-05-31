import { Card, AxisEnum, PlayerEnum } from "../shared/card";

export interface Deck{
    cards: Card[],
    name: string,
    description?: string
}

export interface DeckDescription{
    name: string,
    id?: number,
    description?: string
}

export interface DeckViewerState{
    deck: Deck,
    isLoadingDeckList: boolean,
    isLoadingDeck: boolean,
    deckList: DeckDescription[]
}