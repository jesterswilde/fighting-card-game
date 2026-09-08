import type { Agent } from "../../agent";
import type { GameState } from "../interfaces/stateInterface";
import { makeStateDurations, makeModifiedAxis } from "../util";
import type { GameMods } from "../lobby/interface";
import { healthFromMod, makePlayerStateWithMods } from "../lobby/stateMod";

export const makeGameState = (agents: Agent[], mod: GameMods | null = null) => {
  const { distance, playerStates } = makePlayerStateWithMods(mod);
  const health = healthFromMod(mod);
  const state: GameState = {
    agents,
    numPlayers: 2,
    queue: [],
    decks: agents.map(({ deck }) => deck || []),
    hands: [[], []],
    pickedCards: [],
    health,
    initialHealth: [...health],
    parry: [0, 0],
    block: [0, 0],
    playerStates,
    distance,
    stateDurations: [makeStateDurations(), makeStateDurations()],
    readiedEffects: [[], []],
    readiedMechanics: [[], []],
    readiedDamageEffects: [[], []],
    modifiedAxis: [makeModifiedAxis(), makeModifiedAxis()],
    predictions: [null, null],
    pendingPredictions: [],
    damaged: [false, false],
    setup: [0, 0],
    pendingSetup: [0, 0],
    tagModification: [{}, {}],
    tagsPlayed: [{}, {}],
    handSizeMod: [0, 0],
    nextHandSizeMod: [0, 0],
    turnNumber: 0,
    cardUID: 0,
    events: [],
    currentEvent: [],
  };
  return state;
};
