"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interface_1 = require("./interface");
const stateInterface_1 = require("../gameServer/interfaces/stateInterface");
const possiblePredictions = [stateInterface_1.PredictionEnum.DISTANCE, stateInterface_1.PredictionEnum.MOTION, stateInterface_1.PredictionEnum.NONE, stateInterface_1.PredictionEnum.STANDING];
exports.makeRandomAgent = (deck) => {
    let currentState;
    let player = -1;
    let hand = [];
    return {
        type: interface_1.AgentType.RANDOM,
        username: "Random Randerson",
        deck,
        startGame: (_index) => player = _index,
        gameOver: () => { },
        sendState: (state) => currentState = state,
        sendHand: (cards) => hand = cards,
        sendEvents: (events) => { },
        getCardChoice: () => {
            return new Promise((res, rej) => {
                const choice = Math.floor(Math.random() * hand[player].length);
                res(choice);
            });
        },
        opponentMadeCardChoice: () => {
        },
        getPrediction: () => {
            return new Promise((res, rej) => {
                const choice = Math.floor(Math.random() * possiblePredictions.length);
                return possiblePredictions[choice];
            });
        },
        getUsedForceful: (cardName, mechanicIndex) => {
            return new Promise((res, rej) => {
                res(Math.random() > 0.5);
            });
        },
        getPickOneChoice: (cardName, mechanicIndex) => {
            return new Promise((res, rej) => {
                res(Math.random() > 0.5 ? 0 : 1);
            });
        }
    };
};
