import { Card, Mechanic, AxisEnum, PlayerEnum } from "../../shared/card";
import { Socket } from "socket.io";
import { EventAction } from "./gameEvent";

export interface GameState{
    sockets: Socket[]
    numPlayers: number
    decks: Card[][]
    hands: Card[][]
    pickedCards: Array<Card | null> 
    queue: Card[][][]
    playerStates: PlayerState[]
    lockedState: LockState
    distance: DistanceEnum
    stateDurations: PlayerStateDuration[]
    modifiedAxis: ModifiedAxis
    parry: number[]
    block: number[]
    tagModification: TagModification[]
    health: number[]
    damaged: boolean[]
    readiedEffects: ReadiedEffect[][]
    damageEffects: ReadiedEffect[][]
    predictions?: PredictionState[]
    pendingPredictions?: PredictionState[]
    checkedFocus?: boolean
    incrementedQueue?: boolean
    events: EventAction[]
    pendingEvents?: ReadiedEffect[][]
    pendingCardEvents?: Card[]
    turnIsOver?: boolean
    turnNumber: number
    winner?: number
    cardUID: number
}

export interface TagModification{
    [tag: string]: Mechanic[]
}

export interface ReadiedEffect{
    card: Card,
    mechanic: Mechanic,
    isEventOnly?: boolean,
    isHappening?: boolean,
    happensTo?: HappensEnum[]
}

export enum HappensEnum{
    NEVER_AFFECTED,
    HAPPENS,
    BLOCKED
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
}
export interface PlayerState {
    standing: StandingEnum,
    motion: MotionEnum,
    poise: number
}

export interface PredictionState{
    card: Card,
    prediction: PredictionEnum,
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
    ANTICIPATING,
    NOT_ANTICIPATING
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

