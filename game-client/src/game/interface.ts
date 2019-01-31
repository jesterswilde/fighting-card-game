import { Card, Mechanic, AxisEnum } from "../interfaces/card";

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
    lockedState: LockState
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
    balance: BalanceEnum
}

export interface PredictionState{
    player:number
    prediction: PredictionEnum | null
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

