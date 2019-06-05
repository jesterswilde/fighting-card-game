import { Card } from "../shared/card";
import { DeckDescription } from "../deckViewer/interface";
import { FightingStyleDescription } from "../fightingStyles/interface";

export interface EditingDeck {
    id: number,
    name: string,
    cards: string[],
    possibleCards: {
        [style: string]: Card[]
    },
    description: string,
    styles: string[]
}

export interface UpdateDeckObj {
    name?: string,
    description?: string,
    cards?: string[],
    styles?: string[],
}

export interface DeckEditState {
    deck: EditingDeck
    uneditedDeck: EditingDeck
    allDecks: DeckDescription[]
    allStyleDesc: FightingStyleDescription[]
    savedStyles: FullStyleObj
    canUpdate: boolean
    showingUnusedStyles: boolean
}

export interface FullStyleObj {
    [style: string]: Card[]
}
