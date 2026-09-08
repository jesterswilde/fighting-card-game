import { getFightingStyleByName } from "../styles";
import { GameState, PredictionEnum } from "../gameServer/interfaces/stateInterface";
import { AgentType } from "../agent/interface";
import { Card } from "../shared/card";
import { Catalog, Observation, PersonaAgent } from "./types";
import { seededRandom } from "./random";

/** Preserve shared card references inside a simulation; never retain live agents/functions. */
export function cloneData<T>(value: T, seen = new Map<any, any>()): T {
  if (typeof value === "function") {
    throw new Error("Cannot clone a function as simulation data");
  }
  if (value === null || typeof value !== "object") {
    return value;
  }
  if (seen.has(value)) {
    return seen.get(value);
  }
  const copy: any = Array.isArray(value) ? [] : {};
  seen.set(value, copy);
  Object.keys(value).forEach((key) => {
    if (typeof value[key] !== "function") {
      copy[key] = cloneData(value[key], seen);
    }
  });
  return copy;
}
export const noopAgent = (): PersonaAgent => ({
  type: AgentType.PERSONA,
  username: "simulation",
  startGame: () => {},
  gameOver: () => {},
  sendState: () => {},
  sendHand: () => {},
  sendEvents: () => {},
  opponentMadeCardChoice: () => {},
  getCardChoice: async () => 0,
  getPickOneChoice: async () => 0,
  getUsedForceful: async () => false,
  getPrediction: async () => PredictionEnum.NONE,
});
export function cloneGame(state: GameState, seed = 1): GameState & { random: () => number } {
  const { agents, random, cardCatalog, ...data } = state;
  const result: GameState & { random: () => number } = {
    ...cloneData(data),
    agents: [noopAgent(), noopAgent()],
    random: seededRandom(seed),
  };
  // Catalog is read-only input. The engine clones any card it retrieves from it.
  result.cardCatalog = cardCatalog;
  result.quiet = true;
  result.resolutionBudget = 200;
  return result;
}
export function ownedCard(card: Card, player: number, id: number): Card {
  const copy = cloneData(card);
  copy.player = player;
  copy.opponent = 1 - player;
  copy.id = id;
  return copy;
}
export function schoolPool(schools: string[], catalog: Catalog, player: number): Card[] {
  const names = new Set<string>();
  [...new Set([...schools, "Generic"])].forEach((school) => {
    const registered = getFightingStyleByName(school);
    const members = registered
      ? registered.cards
      : Object.keys(catalog).filter((name) => catalog[name].style === school);
    members.filter((name) => !!catalog[name]).forEach((name) => names.add(name));
  });
  return [...names]
    .sort()
    .map((name, i) => ownedCard(catalog[name], player, 100000 + player * 10000 + i));
}

/** Explicit public allowlist. Never copy opposing hands, decks, choices, private profiles or RNG. */
export function observeGame(
  source: GameState,
  player: number,
  opponentSchools: string[],
  catalog: Catalog,
): Observation {
  const other = 1 - player;
  const publicData = cloneData({
    numPlayers: source.numPlayers,
    queue: source.queue,
    playerStates: source.playerStates,
    distance: source.distance,
    stateDurations: source.stateDurations,
    modifiedAxis: source.modifiedAxis,
    parry: source.parry,
    block: source.block,
    setup: source.setup,
    pendingSetup: source.pendingSetup,
    tagModification: source.tagModification,
    tagsPlayed: source.tagsPlayed,
    health: source.health,
    initialHealth: source.initialHealth,
    damaged: source.damaged,
    predictions: source.predictions,
    pendingPredictions: source.pendingPredictions,
    turnNumber: source.turnNumber,
    handSizeMod: source.handSizeMod,
    nextHandSizeMod: source.nextHandSizeMod,
    winner: source.winner,
    checkedFocus: source.checkedFocus,
    incrementedQueue: source.incrementedQueue,
    turnIsOver: source.turnIsOver,
  });
  [publicData.predictions, publicData.pendingPredictions].forEach((predictions) => {
    if (predictions[other]) {
      delete predictions[other].prediction;
    }
  });
  const state: GameState = {
    ...publicData,
    agents: [noopAgent(), noopAgent()],
    decks: [[], []],
    hands: [[], []],
    pickedCards: [null, null],
    readiedEffects: [[], []],
    readiedMechanics: [[], []],
    readiedDamageEffects: [[], []],
    cardUID: 200000,
    events: [],
    currentEvent: [],
    quiet: true,
    cardCatalog: catalog,
  };
  state.decks[player] = cloneData(source.decks[player]);
  state.hands[player] = cloneData(source.hands[player] || []);
  state.decks[other] = schoolPool(opponentSchools, catalog, other);
  // One-copy school-pool prior: exclude cards publicly in the queue.
  state.queue.forEach((slot) =>
    (slot[other] || []).forEach((card) => {
      const index = state.decks[other].findIndex((c) => c.name === card.name);
      if (index >= 0) {
        state.decks[other].splice(index, 1);
      }
    }),
  );
  return { state, player, opponentSchools: [...opponentSchools] };
}
export function receiveHand(observation: Observation, hands: (Card | null)[][]) {
  const { state, player } = observation,
    other = 1 - player;
  state.hands[player] = cloneData(
    (hands[player] || []).filter((card): card is Card => card !== null),
  );
  const ids = new Set(state.hands[player].map((c) => c.id));
  state.decks[player] = state.decks[player].filter((c) => !ids.has(c.id));
  state.hands[other] = cloneData(
    (hands[other] || []).filter((c): c is Card => c !== null && !!c.isFaceUp),
  );
  observation.opponentHandSize = (hands[other] || []).length;
  state.hands[other].forEach((card) => {
    const index = state.decks[other].findIndex((c) => c.name === card.name);
    if (index >= 0) {
      state.decks[other].splice(index, 1);
    }
  });
}
