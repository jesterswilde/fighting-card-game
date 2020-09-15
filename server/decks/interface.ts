import { Card } from "../shared/card";

export interface Deck{
    id?: number,
    name: string,
    styles: string[],
    description?: string,
    deckList: string[] 
}