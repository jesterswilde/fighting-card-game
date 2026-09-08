import type { GameState, PredictionEnum } from "../gameServer/interfaces/stateInterface";
import type { Card } from "../shared/card";
import type { EventAction } from "../gameServer/interfaces/gameEvent";

export interface AgentBase {
  username: string;
  schools?: string[];
  sendChoiceState?: (state: GameState) => void;
  deck?: Card[];
  startGame: (index: number) => void;
  gameOver: (didWin: boolean, state: GameState) => void;
  sendState: (state: GameState) => void;
  sendHand: (cards: (Card | null)[][]) => void;
  sendEvents: (events: EventAction[][]) => void;
  getCardChoice: () => Promise<number>;
  opponentMadeCardChoice: () => void;
  getPrediction: () => Promise<PredictionEnum>;
  getUsedForceful: (mech: MechanicOnCard) => Promise<boolean>;
  getPickOneChoice: (mech: MechanicOnCard) => Promise<number>;
}

export enum AgentType {
  HUMAN = "human",
  RANDOM = "random",
  PERSONA = "persona",
}

export interface MechanicOnCard {
  cardName: string;
  index: number;
}
