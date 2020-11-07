import { Agent } from "../../agent";
import { handleDCDuringGame } from "./disconnect";
import { playGame } from "../game/game";
import { GameState, DistanceEnum } from "../interfaces/stateInterface";
import { STARTING_HEALTH } from "../gameSettings";
import { makePlayerState, makeStateDurations, makeModifiedAxis } from "../util";

export const createGame = async (players: Agent[]) => {
  const state = makeGameState(players);
  handleDCDuringGame(players); 
  playGame(state);
};
  
  
const makeGameState = (agents: Agent[]) => {
  const state: GameState = {
    agents,
    numPlayers: 2,
    queue: [],
    decks: agents.map(({deck}) => deck),
    hands: [[], []],
    pickedCards: [],
    health: [STARTING_HEALTH, STARTING_HEALTH],
    parry: [0, 0],
    block: [0, 0],
    playerStates: [makePlayerState(), makePlayerState()],
    distance: DistanceEnum.FAR,
    stateDurations: [makeStateDurations(), makeStateDurations()],
    readiedEffects: [[], []],
    readiedMechanics: [[],[]],
    readiedDamageEffects: [[], []],
    modifiedAxis: [makeModifiedAxis(), makeModifiedAxis()],
    predictions: [null, null],
    pendingPredictions: [],
    damaged: [false, false],
    setup: [0, 0],
    pendingSetup: [0, 0],
    tagModification: [{}, {}],
    tagsPlayed: [{}, {}],
    handSizeMod: [0,0],
    nextHandSizeMod: [0,0],
    turnNumber: 0,
    cardUID: 0,
    events: [],
    currentEvent: null
  };
  return state;
};