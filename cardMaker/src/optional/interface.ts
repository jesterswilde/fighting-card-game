import { getID } from '../utils';

export interface Optional {
    id: number
    requirements: number[], // StatePiece
    effects: number[] // Mechanic
}

export const makeDefaultOptional = (): Optional=>{
    return {
        id: getID(),
        requirements: [],
        effects: []
    }
}

export interface OptionalState{
    optionalById: {
        [id: number]: Optional
    }
}