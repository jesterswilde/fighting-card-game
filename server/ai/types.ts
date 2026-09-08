import type { AgentBase, AgentType } from "../agent/interface";
import type { Card, Requirement } from "../shared/card";
import type { GameState } from "../gameServer/interfaces/stateInterface";

export type Catalog = { [name: string]: Card };
export interface OutcomePreferences {
  selfHealthAboveHalf: number;
  selfHealthBelowHalf: number;
  opponentDamage: number;
  poise: number;
  opponentPoise: number;
  block: number;
  opponentBlock: number;
  setup: number;
  opponentSetup: number;
  handSize: number;
  opponentHandSize: number;
  win: number;
  loss: number;
}
export interface StatePreference extends Requirement {
  value: number;
}
export interface Preferences {
  cardPreferences: { [name: string]: number };
  outcomes: OutcomePreferences;
  states: StatePreference[];
}
export interface PreferenceOverrides {
  cardPreferences?: { [name: string]: number };
  outcomes?: Partial<OutcomePreferences>;
  states?: StatePreference[];
}
export interface PersonaConfig {
  name: string;
  schools: string[];
  cards: string[];
  overrides?: PreferenceOverrides;
  dice?: { count: number; sides: number };
  samples?: number;
  weights?: { outcomes?: number; pending?: number; draw?: number };
  seed?: number;
}
export interface ResolvedPersona {
  config: PersonaConfig;
  preferences: Preferences;
  dice: { count: number; sides: number };
  samples: number;
  weights: { outcomes: number; pending: number; draw: number };
}
export interface CardScore {
  card: string;
  preference: number;
  outcomes: number;
  pending: number;
  draw: number;
  roll: number;
  total: number;
}
export interface DecisionReport {
  turn: number;
  selected: number;
  candidates: CardScore[];
  opponentSamples: string[];
}
export interface PersonaAgent extends AgentBase {
  type: AgentType.PERSONA;
  getLastDecision?: () => DecisionReport | undefined;
}
export interface Observation {
  state: GameState;
  player: number;
  opponentSchools: string[];
  opponentHandSize?: number;
}
