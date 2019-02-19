import { Card } from "../interfaces/card";

export interface Deck{
    cards: Card[],
    name: string,
    description?: string
}

export interface DeckDescription{
    name: string,
    description?: string
}

export interface DeckViewerState{
    deck: Deck,
    isLoadingDeckList: boolean,
    isLoadingDeck: boolean,
    deckList: DeckDescription[]
}