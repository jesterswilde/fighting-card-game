import { Mechanic, Card, AxisEnum, Effect } from "../../../shared/card";
import {
  GameState,
  PredictionState,
  PredictionEnum,
} from "../../interfaces/stateInterface";
import {
  readyEffects,
} from "../readiedEffects";
import { ControlEnum } from "../../errors";
import { PredictionEvent } from "../../interfaces/gameEvent";
import { predictionRevealEvent } from "../events";

/*
    Predictions are made on the turn after you play the card with prediction, but before the new card is playd. 
    Card with prediction played > Results > Make prediction > Next card
    Predictions live on gamestate
*/

export const movePredictionsToPending = (
  mechanic: Mechanic,
  card: Card,
  player: number,
  opponent: number,
  state: GameState
) => {
  state.pendingPredictions[card.player] = state.pendingPredictions[
    card.player
  ] || { readiedEffects: [], targetPlayer: opponent };
  const reaEffs = readyEffects(
    mechanic.effects,
    card,
    state
  );
  state.pendingPredictions[card.player].readiedEffects.push(...reaEffs);
};

export const didPredictionHappen = (
  prediction: PredictionState,
  player: number,
  state: GameState
): boolean => {
  switch (prediction.prediction) {
    case PredictionEnum.DISTANCE:
      return state.modifiedAxis[player].distance;
    case PredictionEnum.MOTION:
      return state.modifiedAxis[player].motion;
    case PredictionEnum.STANDING:
      return state.modifiedAxis[player].standing;
    case PredictionEnum.NONE:
      return (
        !state.modifiedAxis[player].balance &&
        !state.modifiedAxis[player].distance &&
        !state.modifiedAxis[player].motion &&
        !state.modifiedAxis[player].standing
      );
  }
};

export const checkPredictions = (state: GameState) => {
  const { predictions } = state;
  let stateChanged = false;
  const predEvents: PredictionEvent[] = predictions.map((pred, player) => {
      const didHappen = didPredictionHappen(pred, pred.targetPlayer, state);
      if (didHappen) {
        stateChanged = true;
        state.readiedEffects[player].push(...pred.readiedEffects);
      }
      return {
        didHappen,
        prediction: pred.prediction,
        player,
        targetPlayer: pred.targetPlayer,
        correctGuesses: getCorrectGuessArray(pred.targetPlayer, state)
      };
  });
  if(predictions.some(pred => pred !== null || pred !== undefined))
    predictionRevealEvent(predEvents, state)
  if (stateChanged) {
    throw ControlEnum.NEW_EFFECTS;
  }
};

const markAxisChange = (effect: Effect, card: Card, state: GameState) => {
  const { player } = card;
  const axisObj = state.modifiedAxis[player];
  switch (effect.axis) {
    case AxisEnum.MOVING:
    case AxisEnum.STILL:
      axisObj.motion = true;
      break;
    case AxisEnum.STANDING:
    case AxisEnum.PRONE:
      axisObj.standing = true;
      break;
    case AxisEnum.CLOSE:
    case AxisEnum.CLOSER:
    case AxisEnum.GRAPPLED:
    case AxisEnum.FAR:
    case AxisEnum.FURTHER:
      axisObj.distance = true;
      break;
  }
};

export const markAxisChanges = (state: GameState) => {
  if (state.readiedEffects) {
    state.readiedEffects.forEach((playerEffect = []) => {
      playerEffect.forEach(({ effect, card }) => {
        markAxisChange(effect, card, state);
      });
    });
  }
};

export const getCorrectGuessArray = (
  targetPlayer: number,
  state: GameState
) => {
  const correctGuesses: PredictionEnum[] = [];
  if (state.modifiedAxis[targetPlayer].distance)
    correctGuesses.push(PredictionEnum.DISTANCE);
  if (state.modifiedAxis[targetPlayer].motion)
    correctGuesses.push(PredictionEnum.MOTION);
  if (state.modifiedAxis[targetPlayer].standing)
    correctGuesses.push(PredictionEnum.STANDING);
  if (correctGuesses.length === 0) correctGuesses.push(PredictionEnum.NONE);
  return correctGuesses;
};

//SOCKET SECTION
export const playerMakesPredictions = async (player: number, state:  GameState)=>{
  const { predictions, agents } = state;
  const predictionObj = predictions[player];
  if (predictionObj) 
    predictionObj.prediction = await  agents[player].getPrediction();
};