export interface Optional {
    id: number
    requirements: number[], // StatePiece
    effects: number[] // Mechanic
}

export interface OptionalState{
    optionalById: {
        [id: number]: Optional
    }
}