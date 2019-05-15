import { Card } from "../shared/card";

export interface DeckDescription {
    name: string,
    deckList: string[]
    description?: string
}

export interface PossibleCards{
    [style: string]: Card[]
}

export interface EditedDeck {
    name?: string,
    description?: string,
    cards?: string[],
    styles?: string[], 
}