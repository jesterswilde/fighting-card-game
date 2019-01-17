import { Card, Mechanic } from "./cardInterface";

export interface GameState{
    playerStates: PlayerState[]
    block: number[]
    queues: Card[][][]
    distance: DistanceEnum
    currentPlayer: number
    health: number[]
    decks: Card[][]
    hands: Card[][]
    damaged: boolean[]
    pickedCard?: Card
    readiedEffects: []
    winner?: number
    turnOver?: boolean
}
export interface PlayerState {
    standing: StandingEnum,
    motion: MotionEnum,
    balance: BalanceEnum
}
export enum BalanceEnum{
    BALANCED,
    UNBALANCED,
    ANTICIPATING
}
export enum StandingEnum{
    PRONE,
    STANDING
}
export enum MotionEnum{
    STILL,
    MOVING
}
export enum DistanceEnum{
    GRAPPLED,
    CLOSE,
    FAR
}

