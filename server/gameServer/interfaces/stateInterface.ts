import { Card, Mechanic } from "./cardInterface";
import { Socket } from "socket.io";

export interface GameState{
    sockets: Socket[]
    playerStates: PlayerState[]
    stateDurations: PlayerStateDuration[]
    modifiedAxis: ModifiedAxis
    block: number[]
    queue: Card[][]
    distance: DistanceEnum
    currentPlayer: number
    health: number[]
    decks: Card[][]
    hands: Card[][]
    damaged: boolean[]
    pickedCard?: Card
    readiedEffects: Mechanic[]
    winner?: number
    turnIsOver?: boolean
    predictions?: PredictionState[]
    pendingPredictions?: PredictionState[]
    checkedFocus?: boolean
    incrementedQueue?: boolean
}
export interface ModifiedAxis {
    standing: boolean
    motion: boolean 
    balance: boolean
    distance: boolean
}
export interface PlayerStateDuration{
    standing: number | null, 
    motion: number | null,
    balance: number | null,
}
export interface PlayerState {
    standing: StandingEnum,
    motion: MotionEnum,
    balance: BalanceEnum
}

export interface PredictionState{
    player: number,
    prediction: PredictionEnum,
    mechanics: Mechanic[]
}

export enum PredictionEnum {
    NONE,
    DISTANCE,
    STANDING,
    MOTION,
    BALANCE
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

