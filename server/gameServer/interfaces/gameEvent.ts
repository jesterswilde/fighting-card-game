import { AxisEnum, Effect, PlayerEnum } from "../../shared/card";
import { PredictionEnum, HappensEnum } from "./stateInterface";

export enum EventType {
  PLAYED_CARD = "PlayedCard",
  MECHANIC = "MechanicActivation",
  REVEAL_PREDICTION = "RevealPrediction",
  GAME_OVER = "GameOver",
  REFLEX = "Reflex",
  USED_FORCEFUL = "Forceful",
  PICKED_ONE = "PickedOne",
  HAS_PREDICTION = "HasPrediction",
}

export interface EventAction {
  type: EventType;
  mechanic?: string;
  effects?: EventEffect[];
  card?: CardEvent;
  reflexingCard?: string; 
  prediction?: PredictionEvent;
  winner?: number;
}

export interface FrontendEvent{
  type: EventType;
  mechanic?: string;
  effects?: FrontEndEffect[];
  card?: CardEvent;
  reflexingCard?: string; 
  prediction?: PredictionEvent;
  winner?: number;
}

export interface CardEvent{
  cardName: string,
  priority: number
}

export interface PredictionEvent {
  prediction: PredictionEnum;
  player: number;
  targetPlayer: number;
  didHappen: boolean;
  correctGuesses: PredictionEnum[]
}
export interface EventEffect{
  type: EventEffectType
  display?: string
  effect?: Effect
  happensTo?: HappensEnum[]
}

export enum EventEffectType {
  EFFECT,
  CHOICE
}
interface EventEffectNormal{
  type: EventEffectType.EFFECT,
  axis: AxisEnum, 
  amount?: number, 
  player: PlayerEnum, 
  isBlocked: boolean
}
interface EventEffectChoice{
  type: EventEffectType.CHOICE,
  display: string
}
export type FrontEndEffect = EventEffectChoice | EventEffectNormal
/*
export interface FrontEndEffect{
  type: EventEffectType,
  display?: string,
  axis?: AxisEnum
  amount?: number
  player?: PlayerEnum
  isBlocked?: boolean
}*/
