import { Card, Mechanic, AxisEnum, PlayerEnum, Effect } from "../../shared/card";
import { EventAction } from "./gameEvent";
import { Agent } from "../../agent";

export interface GameState {
  agents: Agent[];
  numPlayers: number;
  decks: Card[][];
  hands: Card[][];
  pickedCards: Array<Card | null>;
  queue: Card[][][];
  playerStates: PlayerState[];
  distance: DistanceEnum;
  stateDurations: PlayerStateDuration[];
  modifiedAxis: ModifiedAxis[];
  parry: number[];
  block: number[];
  setup: number[];
  pendingSetup: number[];
  tagModification: TagModification[];
  tagsPlayed: { [tag: string]: number }[];
  health: number[];
  damaged: boolean[];
  readiedEffects: ReadiedEffect[][];
  readiedDamageEffects: ReadiedEffect[][];
  readiedMechanics: ReadiedMechanic[][];
  predictions: PredictionState[];
  pendingPredictions: PredictionState[];
  checkedFocus?: boolean;
  incrementedQueue?: boolean;
  events: EventAction[][];
  currentEvent: EventAction[];
  turnIsOver?: boolean;
  turnNumber: number;
  winner?: number;
  cardUID: number;
  handSizeMod?: number[];
  nextHandSizeMod?: number[];
}

export interface QueueCard{
  name: string
  activeMechanics?: number[]
}

export interface HandCard{
  name: string
  activeCritical?: number[]
  appendedEffects?: Effect[]
}

export interface UnityGameState{
  playerStates: PlayerState[],
  stateDurations: PlayerStateDuration,
  block: number[],
  queue: Card[][][],
  distance: DistanceEnum,
  health: number[],
  damaged: boolean[],
  predictions: PredictionState, 
  turnNumber: number,
}

export interface TagModification {
  [tag: string]: Effect[];
}

export interface ReadiedEffect {
  card: Card;
  effect: Effect
  happensTo?: HappensEnum[];
  eventsHaveProcessed?: boolean
}
export interface ReadiedMechanic{
  card: Card;
  mechanic: Mechanic
  eventsHaveProcessed?: boolean
}

export enum HappensEnum {
  NEVER_AFFECTED,
  HAPPENS,
  BLOCKED,
}

export interface ModifiedAxis {
  standing: boolean;
  motion: boolean;
  balance: boolean;
  distance: boolean;
}

export interface LockState {
  distance: number | null;
  players: PlayerLockState[];
}

export interface PlayerLockState {
  poise: number | null;
  motion: number | null;
  stance: number | null;
}

export interface PlayerStateDuration {
  standing: number | null;
  motion: number | null;
}

export interface PlayerState {
  standing: StandingEnum;
  motion: MotionEnum;
  poise: number;
}

export interface PredictionState {
  targetPlayer: number;
  prediction?: PredictionEnum;
  readiedEffects: ReadiedEffect[];
}



export enum PredictionEnum {
  NONE = "None",
  DISTANCE = "Distance",
  STANDING = "Standing",
  MOTION = "Motion",
}

export enum PoiseEnum {
  BALANCED,
  UNBALANCED,
  ANTICIPATING,
  NOT_ANTICIPATING,
}

export enum StandingEnum {
  PRONE,
  STANDING,
}
export enum MotionEnum {
  STILL,
  MOVING,
}
export enum DistanceEnum {
  GRAPPLED,
  CLOSE,
  FAR,
}
