"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerMakesPredictions = exports.predictionRevealEvent = exports.getCorrectGuessArray = exports.markAxisChanges = exports.checkPredictions = exports.didPredictionHappen = exports.movePredictionsToPending = exports.movePendingPredictions = void 0;
const card_1 = require("../../../shared/card");
const stateInterface_1 = require("../../interfaces/stateInterface");
const readiedEffects_1 = require("../readiedEffects");
const errors_1 = require("../../errors");
const gameEvent_1 = require("../../interfaces/gameEvent");
const events_1 = require("../events");
/*
    Predictions are made on the turn after you play the card with prediction, but before the new card is playd.
    Card with prediction played > Results > Make prediction > Next card
    Predictions live on gamestate
*/
exports.movePendingPredictions = (state) => {
    state.predictions = state.pendingPredictions;
    state.pendingPredictions = state.agents.map(_ => null);
};
//This is called by the mechanic handler
exports.movePredictionsToPending = (mechanic, card, player, opponent, state) => {
    state.pendingPredictions[card.player] = state.pendingPredictions[card.player] || { readiedEffects: [], targetPlayer: opponent };
    const reaEffs = readiedEffects_1.makeReadyEffects(mechanic.effects, card);
    state.pendingPredictions[card.player].readiedEffects.push(...reaEffs);
    events_1.addDisplayEvent("Predicting", player, state);
};
exports.didPredictionHappen = (prediction, player, state) => {
    switch (prediction.prediction) {
        case stateInterface_1.PredictionEnum.DISTANCE:
            return state.modifiedAxis[player].distance;
        case stateInterface_1.PredictionEnum.MOTION:
            return state.modifiedAxis[player].motion;
        case stateInterface_1.PredictionEnum.STANDING:
            return state.modifiedAxis[player].standing;
        case stateInterface_1.PredictionEnum.NONE:
            return (!state.modifiedAxis[player].balance &&
                !state.modifiedAxis[player].distance &&
                !state.modifiedAxis[player].motion &&
                !state.modifiedAxis[player].standing);
    }
};
exports.checkPredictions = (state) => {
    const { predictions } = state;
    let stateChanged = false;
    const predEvents = predictions.map((pred, player) => {
        if (pred === null)
            return null;
        const didHappen = exports.didPredictionHappen(pred, pred.targetPlayer, state);
        if (didHappen) {
            stateChanged = true;
            state.readiedEffects[player].push(...pred.readiedEffects);
        }
        return {
            didHappen,
            prediction: pred.prediction,
            player,
            targetPlayer: pred.targetPlayer,
            correctGuesses: exports.getCorrectGuessArray(pred.targetPlayer, state),
        };
    });
    state.predictions = [];
    if (predictions.some((pred) => pred !== null && pred !== undefined))
        exports.predictionRevealEvent(predEvents, state);
    if (stateChanged) {
        throw errors_1.ControlEnum.NEW_EFFECTS;
    }
};
const markAxisChange = (effect, card, state) => {
    const { player } = card;
    const axisObj = state.modifiedAxis[player];
    switch (effect.axis) {
        case card_1.AxisEnum.MOVING:
        case card_1.AxisEnum.STILL:
            axisObj.motion = true;
            break;
        case card_1.AxisEnum.STANDING:
        case card_1.AxisEnum.PRONE:
            axisObj.standing = true;
            break;
        case card_1.AxisEnum.CLOSE:
        case card_1.AxisEnum.CLOSER:
        case card_1.AxisEnum.GRAPPLED:
        case card_1.AxisEnum.FAR:
        case card_1.AxisEnum.FURTHER:
            axisObj.distance = true;
            break;
    }
};
exports.markAxisChanges = (state) => {
    if (state.readiedEffects) {
        state.readiedEffects.forEach((playerEffect = []) => {
            playerEffect.forEach(({ effect, card }) => {
                markAxisChange(effect, card, state);
            });
        });
    }
};
exports.getCorrectGuessArray = (targetPlayer, state) => {
    const correctGuesses = [];
    if (state.modifiedAxis[targetPlayer].distance)
        correctGuesses.push(stateInterface_1.PredictionEnum.DISTANCE);
    if (state.modifiedAxis[targetPlayer].motion)
        correctGuesses.push(stateInterface_1.PredictionEnum.MOTION);
    if (state.modifiedAxis[targetPlayer].standing)
        correctGuesses.push(stateInterface_1.PredictionEnum.STANDING);
    if (correctGuesses.length === 0)
        correctGuesses.push(stateInterface_1.PredictionEnum.NONE);
    return correctGuesses;
};
exports.predictionRevealEvent = (predictions, state) => {
    events_1.startNewEvent(gameEvent_1.EventType.REVEAL_PREDICTION, state);
    predictions.forEach((pred, i) => {
        if (!pred)
            return;
        state.currentEvent[i].prediction = pred;
    });
};
//SOCKET SECTION
exports.playerMakesPredictions = async (player, state) => {
    const { predictions, agents } = state;
    const predictionObj = predictions[player];
    if (predictionObj) {
        predictionObj.prediction = await agents[player].getPrediction();
    }
};
