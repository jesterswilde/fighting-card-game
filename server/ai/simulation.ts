import { assertOwnedCard } from "../shared/card";
import { Card, Effect, MechanicEnum } from "../shared/card";
import { GameState, PredictionEnum } from "../gameServer/interfaces/stateInterface";
import { ControlEnum } from "../gameServer/errors";
import { playCards, incrementQueue, addCardsToQueue } from "../gameServer/game/playCard";
import { pickCard } from "../gameServer/game/playCards/playerInput";
import { cardHappens, checkForVictor } from "../gameServer/game/playCards/cardHappens";
import { applyCollectedDamage } from "../gameServer/game/playCards/handleDamage";
import { makeReadyEffects, makeReadyMechanics } from "../gameServer/game/readiedEffects";
import { makeEffectsFromEnhance } from "../gameServer/game/mechanics/enhance";
import { makeEffectsFromBuff } from "../gameServer/game/mechanics/buff";
import { canUseCritical } from "../gameServer/game/mechanics/critical";
import { endTurn } from "../gameServer/game/endTurn";
import { startTurn } from "../gameServer/game/startTurn";
import { cloneData, cloneGame, noopAgent, ownedCard } from "./state";
import { Preferences } from "./types";
import { outcomeValue } from "./value";
import { pickHighest } from "./random";

export interface ChoicePlan {
  picks: { [index: number]: number };
  forceful: { [index: number]: boolean };
}
const ordinaryMechanics = (card: Card) =>
  (card.mechanics || []).filter(
    (m) =>
      ![MechanicEnum.CRITICAL, MechanicEnum.PICK_ONE, MechanicEnum.FORCEFUL].includes(m.mechanic),
  );
const baseEffects = (card: Card, state: GameState) => {
  assertOwnedCard(card);
  return [
    ...(card.effects || []),
    ...makeEffectsFromEnhance(card),
    ...makeEffectsFromBuff(card),
    ...(card.mechanics || [])
      .filter(
        (m) =>
          m.mechanic === MechanicEnum.CRITICAL &&
          canUseCritical(m, card.player, card.opponent, state),
      )
      .reduce((all, m) => all.concat(m.effects || []), [] as Effect[]),
  ];
};

/** Cheap leaf evaluator: real effect/trigger/conflict handlers, no opponent search or future draws.
 * Reflex chains are intentionally not searched here; full exchange rollouts execute them. */
export function previewBundle(
  source: GameState,
  card: Card,
  effects: Effect[],
  cost = 0,
): GameState {
  assertOwnedCard(card);

  const state = cloneGame(source);
  state.hands = [[], []];
  state.pickedCards = [null, null];
  state.decks[1 - card.player] = [];
  state.readiedEffects = [[], []];
  state.readiedMechanics = [[], []];
  state.readiedDamageEffects = [[], []];
  state.currentEvent = [{}, {}] as any;
  const carrier = cloneData(card);
  state.playerStates[card.player].poise -= cost;
  state.pickedCards[card.player] = carrier;
  incrementQueue(state);
  addCardsToQueue(state);
  state.readiedEffects[card.player] = makeReadyEffects(effects, carrier);
  state.readiedMechanics[card.player] = makeReadyMechanics(ordinaryMechanics(carrier), carrier);
  try {
    cardHappens(state);
  } catch (error) {
    if (error === ControlEnum.PLAY_CARD) {
      // The engine has applied state effects and selected Reflex cards, but not those cards' effects.
      try {
        applyCollectedDamage(state);
        checkForVictor(state);
      } catch (e) {
        if (e !== ControlEnum.GAME_OVER) {
          throw e;
        }
      }
    } else if (error !== ControlEnum.GAME_OVER) {
      throw error;
    }
  }
  return state;
}

/** Generic branch/cost decisions, keyed by mechanic index only. No named-card logic. */
export function planChoices(state: GameState, card: Card, preferences: Preferences): ChoicePlan {
  assertOwnedCard(card);

  const plan: ChoicePlan = { picks: {}, forceful: {} };
  let effects = baseEffects(card, state),
    cost = 0;
  const value = (bundle: Effect[], paid: number) =>
    outcomeValue(state, previewBundle(state, card, bundle, paid), card.player, preferences);
  // Match the engine: resolve all Pick One prompts, then all affordable Forceful prompts.
  (card.mechanics || [])
    .filter((m) => m.mechanic === MechanicEnum.PICK_ONE)
    .forEach((m) => {
      const options = m.choices || [];
      if (!options.length) {
        throw new Error("Pick One must have at least one branch");
      }
      const scores = options.map((option) => value(effects.concat(option), cost));
      const index = scores.indexOf(Math.max(...scores));
      plan.picks[m.index] = index;
      effects = effects.concat(options[index]);
    });
  (card.mechanics || [])
    .filter((m) => m.mechanic === MechanicEnum.FORCEFUL)
    .forEach((m) => {
      const price = m.amount || 0;
      const use =
        state.playerStates[card.player].poise - cost >= price &&
        value(effects.concat(m.effects || []), cost + price) > value(effects, cost);
      plan.forceful[m.index] = use;
      if (use) {
        effects = effects.concat(m.effects || []);
        cost += price;
      }
    });
  return plan;
}
export function previewCard(state: GameState, card: Card, preferences: Preferences): GameState {
  const plan = planChoices(state, card, preferences);
  let effects = baseEffects(card, state),
    cost = 0;
  (card.mechanics || []).forEach((m) => {
    if (m.mechanic === MechanicEnum.PICK_ONE) {
      const branch = m.choices?.[plan.picks[m.index]];
      if (!branch) {
        throw new Error("Missing Pick One branch");
      }
      effects = effects.concat(branch);
    }
    if (m.mechanic === MechanicEnum.FORCEFUL && plan.forceful[m.index]) {
      effects = effects.concat(m.effects || []);
      cost += m.amount || 0;
    }
  });
  return previewBundle(state, card, effects, cost);
}
export function immediateScore(state: GameState, card: Card, preferences: Preferences): number {
  assertOwnedCard(card);

  return (
    (preferences.cardPreferences[card.name] || 0) +
    outcomeValue(state, previewCard(state, card, preferences), card.player, preferences)
  );
}
export function choosePrediction(
  state: GameState,
  player: number,
  preferences: Preferences,
): PredictionEnum {
  const options = [
    PredictionEnum.NONE,
    PredictionEnum.DISTANCE,
    PredictionEnum.MOTION,
    PredictionEnum.STANDING,
  ];
  const opponent = 1 - player;
  const cards = state.hands[opponent].filter(Boolean);
  if (!cards.length) {
    return PredictionEnum.NONE;
  }
  const scores = cards.map((c) => immediateScore(state, c, preferences));
  const likely = cards[scores.indexOf(Math.max(...scores))];
  const axes = (likely.effects || []).map((e) => String(e.axis));
  if (axes.some((a) => ["Grappled", "Close", "Far", "Closer", "Further"].includes(a))) {
    return PredictionEnum.DISTANCE;
  }
  if (axes.some((a) => ["Prone", "Standing"].includes(a))) {
    return PredictionEnum.STANDING;
  }
  if (axes.some((a) => ["Moving", "Still"].includes(a))) {
    return PredictionEnum.MOTION;
  }
  return options[0];
}

/** Starts at the current card decision (startTurn already happened), ends at next decision boundary. */
export async function simulateExchange(
  source: GameState,
  choices: [number, number],
  preferences: Preferences[],
  seed: number,
): Promise<GameState> {
  const state = cloneGame(source, seed);
  state.agents = preferences.map((profile, player) => {
    const plans = new Map<Card, ChoicePlan>();
    const plan = () => {
      const card = state.pickedCards[player];
      if (!card) {
        throw new Error("Choice requested without a selected card");
      }
      const cached = plans.get(card);
      if (cached) {
        return cached;
      }
      const nextPlan = planChoices(state, card, profile);
      plans.set(card, nextPlan);
      return nextPlan;
    };
    return {
      ...noopAgent(),
      getCardChoice: async () =>
        pickHighest(
          state.hands[player].map((c) => immediateScore(state, c, profile)),
          state.random,
        ),
      getPickOneChoice: async (m) => plan().picks[m.index],
      getUsedForceful: async (m) => !!plan().forceful[m.index],
      // Guess without consulting the opposing selected card or hidden prediction.
      getPrediction: async () => state.predictions[player]?.prediction || PredictionEnum.NONE,
    };
  });
  choices.forEach((choice, player) => {
    if (!state.hands[player][choice]) {
      throw new Error("Invalid rollout candidate");
    }
    pickCard(player, choice, state);
  });
  try {
    await playCards(state);
    await endTurn(state);
    await startTurn(state);
  } catch (error) {
    if (error !== ControlEnum.GAME_OVER) {
      throw error;
    }
  }
  return state;
}
