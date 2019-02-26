import { CardJSON } from '../interfaces/cardJSON';

export interface CardState {
    editingCard: Card,
    cardNames: string[]
    filter: string
}

export interface Card {
    name: string,
    tagObjs: TagObj[],
    optional: number[], // Optional
    requirements: number[], // StatePiece
    effects: number[] // Mechanic
}

export interface TagObj {
    id?: number,
    value: string
}

export const makeDefaultCard = (): Card =>{
    const card: Card = {
        name: '',
        optional: [], 
        requirements: [], 
        effects: [],
        tagObjs: []
    }
    return card; 
}

export const makeDefaultCardJSON = (): CardJSON=>{
    const card: CardJSON = {
        name: '',
        optional: [], 
        requirements: [], 
        effects: [],
        tags: []
    }
    return card; 
}