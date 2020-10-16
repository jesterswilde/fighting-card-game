"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = require("../../../shared/card");
const stateInterface_1 = require("../../interfaces/stateInterface");
const readiedEffects_1 = require("../readiedEffects");
const errors_1 = require("../../errors");
const events_1 = require("../events");
/*
    Predictions are made on the turn after you play the card with prediction, but before the new card is playd.
    Card with prediction played > Results > Make prediction > Next card
    Predictions live on gamestate
*/
exports.movePredictionsToPending = (mechanic, card, player, opponent, state) => {
    state.pendingPredictions[card.player] = state.pendingPredictions[card.player] || { readiedEffects: [], targetPlayer: opponent };
    const reaEffs = readiedEffects_1.readyEffects(mechanic.effects, card, state);
    state.pendingPredictions[card.player].readiedEffects.push(...reaEffs);
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
    if (predictions.some((pred) => pred !== null || pred !== undefined))
        events_1.predictionRevealEvent(predEvents, state);
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
//SOCKET SECTION
exports.playerMakesPredictions = (player, state) => __awaiter(this, void 0, void 0, function* () {
    const { predictions, agents } = state;
    const predictionObj = predictions[player];
    if (predictionObj) {
        console.log("Waiting for prediction of player", player);
        predictionObj.prediction = yield agents[player].getPrediction();
    }
});
