import {
  ReadiedEffect,
  GameState,
  HappensEnum,
  ReadiedMechanic,
} from "../interfaces/stateInterface";
import { Mechanic, Card, PlayerEnum, Effect } from "../../shared/card";
import { deepCopy, getOpponent } from "../util";
import { fill } from "lodash";

export const readyMechanics = (
  mechanics: Mechanic[],
  card: Card
): ReadiedMechanic[] => {
  return mechanics.map((mechanic) => ({ mechanic, card }));
};
export const readyMechanic = (
  mechanic: Mechanic,
  card: Card
): ReadiedMechanic => {
  return { mechanic, card };
};

export const readyEffects = (
  effects: Effect[] = [],
  card: Card,
  state: GameState
): ReadiedEffect[] => {
  return effects.map((eff) => readyEffect(eff, card, state));
};

export const readyEffect = (
  effect: Effect,
  card: Card,
  state: GameState
): ReadiedEffect => {
  const happensTo: HappensEnum[] = [];
  happensTo[card.player] =
    effect.player === PlayerEnum.OPPONENT
      ? HappensEnum.NEVER_AFFECTED
      : HappensEnum.HAPPENS;
  happensTo[card.opponent] =
    effect.player === PlayerEnum.PLAYER
      ? HappensEnum.NEVER_AFFECTED
      : HappensEnum.HAPPENS;
  return { effect: deepCopy(effect), card, happensTo };
};

/*
export const addReadiedToState = (readiedArr: ReadiedEffect[], state: GameState) => {
    readiedArr.forEach((readied) => {
        const player = readied.card.player
        if (typeof player !== 'number') {
            throw new Error('card lacks player');
        }
        state.readiedEffects[player].push(readied);
    })
}
*/
