import { cardHappens } from "./playCards/cardHappens";
import { ControlEnum } from "../errors";
import { GameState } from "../interfaces/stateInterface";
import { Card, MechanicEnum } from "../../shared/card";
import { readyEffects, readyMechanics } from "./readiedEffects";
import {
  playersMakePredictions,
  playersPickCards,
  playersMakeCardChoices,
} from "./playCards/playerInput";
import { markAxisChanges, playerMakesPredictions } from "./mechanics/predict";
import { getEnhancementsFromCard } from "./mechanics/enhance";
import { splitArray } from "../util";
import { canUseCritical } from "./mechanics/critical";
import { makeEventsFromReadied, newCardEvent } from "./events";
import { givePlayersCards } from "./drawCards";

export const playCards = async (state: GameState) => {
  try {
    await playersMakePredictions(state);
    console.log("Players predicted");
    givePlayersCards(state);
    await playersPickCards(state);
    console.log("Players picked cards");
    readyEffectsAndMechanics(state);
    newCardEvent(state); //Processes readed effects and mechs
    makeEventsFromReadied(state);
    await playersMakeCardChoices(state);
    markAxisChanges(state); //This is for predictions
    incrementQueue(state);
    addCardsToQueue(state);
    cardHappens(state);
  } catch (err) {
    console.log("err", err);
    if (err === ControlEnum.PLAY_CARD) {
      console.log("caught and playing card");
      await playCards(state);
    } else {
      throw err;
    }
  }
};

export const readyEffectsAndMechanics = (state: GameState) => {
  state.agents.forEach((_, i) => readyPlayerEffectsAndMechanics(state, i));
};

export const readyPlayerEffectsAndMechanics = (
  state: GameState,
  playedBy: number
) => {
  const card = state.pickedCards[playedBy];
  if (card === undefined || card === null) {
    return;
  }
  const {
    effects = [],
    mechanics = [],
    enhancements = [],
    player,
    opponent,
  } = card;
  let [criticals, nonCritMechs] = splitArray(
    mechanics,
    (mech) => mech.mechanic === MechanicEnum.CRITICAL
  );
  criticals = criticals.filter((mech) =>
    canUseCritical(mech, playedBy, opponent, state)
  );
  const enhanceEffects = getEnhancementsFromCard(card);
  state.readiedMechanics[playedBy] = [
    ...state.readiedMechanics[playedBy],
    ...readyMechanics(criticals, card),
    ...readyMechanics(nonCritMechs, card),
  ];
  state.readiedEffects[playedBy] = [
    ...state.readiedEffects[playedBy],
    ...readyEffects(effects, card, state),
    ...readyEffects(enhanceEffects, card, state),
  ];
};

export const incrementQueue = (state: GameState) => {
  const { queue } = state;
  if (!state.incrementedQueue) {
    for (let i = queue.length - 1; i >= 0; i--) {
      queue[i + 1] = queue[i];
    }
    queue[0] = [];
    state.incrementedQueue = true;
  }
};

export const addCardsToQueue = (state: GameState) => {
  state.pickedCards.forEach((card, player) => {
    if (card !== undefined && card !== null) {
      addCardToQueue(card, player, state);
    }
  });
};

const addCardToQueue = (card: Card, player: number, state: GameState) => {
  const { queue } = state;
  const slot = 0;
  state.pickedCards[player] = null;
  queue[slot] = queue[slot] || [];
  queue[slot][player] = queue[slot][player] || [];
  queue[slot][player].push(card);
};
