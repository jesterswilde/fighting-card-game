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
const gameEvent_1 = require("../../interfaces/gameEvent");
const socket_1 = require("../../../shared/socket");
/*
    Predictions are made on the turn after you play the card with prediction, but before the new card is playd.
    Card with prediction played > Results > Make prediction > Next card
    Predictions live on gamestate
*/
exports.reducePredict = (mechanic, card, player, opponent, state) => {
    state.pendingPredictions[card.player] = state.pendingPredictions[card.player] || { readiedEffects: [], targetPlayer: opponent };
    const reaEffs = readiedEffects_1.mechanicsToReadiedEffects(mechanic.mechanicEffects, card, state);
    state.pendingPredictions[card.player].readiedEffects.push(...reaEffs);
};
exports.didPredictionHappen = (prediction, player, state) => {
    switch (prediction.prediction) {
        case (stateInterface_1.PredictionEnum.DISTANCE):
            return state.modifiedAxis[player].distance;
        case (stateInterface_1.PredictionEnum.MOTION):
            return state.modifiedAxis[player].motion;
        case (stateInterface_1.PredictionEnum.STANDING):
            return state.modifiedAxis[player].standing;
        case (stateInterface_1.PredictionEnum.NONE):
            return !state.modifiedAxis[player].balance && !state.modifiedAxis[player].distance
                && !state.modifiedAxis[player].motion && !state.modifiedAxis[player].standing;
    }
    return false;
};
exports.checkPredictions = (state) => {
    const { predictions } = state;
    let stateChanged = false;
    const predEvents = predictions.map((pred, player) => {
        const didHappen = exports.didPredictionHappen(pred, pred.targetPlayer, state);
        if (didHappen) {
            stateChanged = true;
            readiedEffects_1.addReadiedToState(pred.readiedEffects, state);
        }
        return { didHappen, prediction: pred.prediction, player, targetPlayer: pred.targetPlayer };
    });
    exports.addRevealPredictionEvent(predEvents, state);
    state.predictions = [];
    if (stateChanged) {
        throw errors_1.ControlEnum.NEW_EFFECTS;
    }
};
const markAxisChange = (mechanic, card, state) => {
    const { player } = card;
    const axisObj = state.modifiedAxis[player];
    switch (mechanic.axis) {
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
            playerEffect.forEach(({ mechanic, card }) => {
                markAxisChange(mechanic, card, state);
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
exports.addRevealPredictionEvent = (predEvents, state) => {
    const hasEvents = predEvents.some((a) => a !== undefined && a !== null);
    if (hasEvents) {
        const playerEvents = predEvents.map((predEvent, player) => {
            const correctGuesses = exports.getCorrectGuessArray(predEvent.targetPlayer, state);
            return { type: gameEvent_1.EventTypeEnum.REVEAL_PREDICTION, correct: predEvent.didHappen, prediction: predEvent.prediction, correctGuesses };
        });
        state.events.push({ type: gameEvent_1.EventTypeEnum.PREDICTION_SECTION, events: playerEvents });
    }
};
//SOCKET SECTION
exports.playerMakesPredictions = (player, state, { _getPredictions = getPredictions } = {}) => __awaiter(this, void 0, void 0, function* () {
    const { predictions, sockets } = state;
    const prediction = predictions[player];
    const socket = sockets[player];
    if (!prediction)
        return;
    prediction.prediction = yield _getPredictions(state, socket);
});
const getPredictions = (state, socket) => {
    return new Promise((res, rej) => {
        socket.emit(socket_1.SocketEnum.SHOULD_PREDICT);
        socket.once(socket_1.SocketEnum.MADE_PREDICTION, (prediction) => {
            res(prediction);
        });
    });
};
