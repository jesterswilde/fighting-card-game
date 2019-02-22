export interface CardState {
    editingCard: Card | null,
    cardNames: string[]
}

export interface Card {
    name: string,
    tagObjs: TagObj[]
    optional: number[], // Optional
    requirements: number[], // StatePiece
    effects: number[] // Mechanic
}

export interface TagObj {
    id?: number,
    value: string
}