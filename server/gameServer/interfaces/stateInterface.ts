import { Card, Mechanic, AxisEnum } from "./cardInterface";
import { Socket } from "socket.io";
import { EventAction } from "./gameEvent";

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
    readiedEffects: ReadiedEffect[]
    winner?: number
    turnIsOver?: boolean
    predictions?: PredictionState[]
    pendingPredictions?: PredictionState[]
    checkedFocus?: boolean
    incrementedQueue?: boolean
    lockedState: LockState
    events: EventAction[]
}

export interface ReadiedEffect{
    card: Card,
    mechanic: Mechanic
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
    card: Card,
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

