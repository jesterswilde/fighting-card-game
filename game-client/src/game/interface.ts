import { Card, Mechanic } from "../shared/card";

export interface GameState{
    playerStates: PlayerState[]
    stateDurations: PlayerStateDuration[]
    block: number[]
    queue: Card[][]
    distance: DistanceEnum
    currentPlayer: number
    player: number
    health: number[]
    damaged: boolean[]
    predictions?: PredictionState[]
    choices?: Mechanic[][]
    forceful?: {cardName: string, mechanic: Mechanic}
    lockedState: LockState
    turnNumber: number
    hasGameState?: boolean
}
export interface ModifiedAxis {
    standing: boolean
    motion: boolean 
    balance: boolean
    distance: boolean
}

export interface LockState {
    distance: number | null,
    players: PlayerLockState []
}

export interface PlayerLockState{
    poise: number | null,
    motion: number | null,
    stance: number | null,
}
export interface PlayerStateDuration{
    standing: number | null, 
    motion: number | null,
    balance: number | null,
}
export interface PlayerState {
    standing: StandingEnum,
    motion: MotionEnum,
    poise: number   
}

export interface PredictionState{
    player:number
    prediction: PredictionEnum | null
    mechanics: Mechanic[]
}

export enum PredictionEnum {
    NONE = "None",
    DISTANCE = "Distance",
    STANDING = "Standing",
    MOTION = "Motion",
}

export enum PoiseEnum{
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

