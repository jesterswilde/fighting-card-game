import { Card } from "../shared/card";
import { DeckDescription } from "../deckViewer/interface";
import { FightingStyleDescription } from "../fightingStyles/interface";

namespace DeckBuilder{    
    export interface EditingDeck {
        id: number,
        name: string,
        cards: string[],
        possibleCards: Card[], 
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
        allDecks: DeckDescription[]
        allStyleDesc: FightingStyleDescription[]
        savedStyles: FullStyle
    }
    
    export interface FullStyle {
        [style: string]: Card[]
    }
}