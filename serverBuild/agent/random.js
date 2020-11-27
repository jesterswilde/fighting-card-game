"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeRandomAgent = void 0;
const interface_1 = require("./interface");
const stateInterface_1 = require("../gameServer/interfaces/stateInterface");
const Cards_1 = require("../cards/Cards");
const possiblePredictions = [
    stateInterface_1.PredictionEnum.DISTANCE,
    stateInterface_1.PredictionEnum.MOTION,
    stateInterface_1.PredictionEnum.NONE,
    stateInterface_1.PredictionEnum.STANDING,
];
exports.makeRandomAgent = (deck = Cards_1.deckListToCards(deckList)) => {
    let currentState;
    let player = -1;
    let hand = [];
    return {
        type: interface_1.AgentType.RANDOM,
        username: "Random Randerson",
        deck,
        startGame: (_index) => (player = _index),
        gameOver: () => { },
        sendState: (state) => (currentState = state),
        sendHand: (cards) => (hand = cards),
        sendEvents: (events) => { },
        getCardChoice: () => {
            return new Promise((res, rej) => {
                const choice = Math.floor(Math.random() * hand[player].length);
                res(choice);
            });
        },
        opponentMadeCardChoice: () => { },
        getPrediction: () => {
            console.log("Asking ai for prediction");
            return new Promise((res, rej) => {
                const choice = Math.floor(Math.random() * possiblePredictions.length);
                res(possiblePredictions[choice]);
            });
        },
        getUsedForceful: (mechOnCard) => {
            return new Promise((res, rej) => {
                res(Math.random() > 0.5);
            });
        },
        getPickOneChoice: (mechOnCard) => {
            return new Promise((res, rej) => {
                res(Math.random() > 0.5 ? 0 : 1);
            });
        },
    };
};
const deckList = [
    'Neck Break',
    'Circle Opponent',
    'Going For The Pin',
    'Leg Grab',
    'Pile Driver',
    'Study Balance',
    'Joint Lock',
    'To The Ground',
    'Defensive Crawl',
    "Throat Jab",
    "Groin Stomp",
    "Going For The High Ground",
    "Rip From Socket",
    "Spring Trap",
    "Makeshift Weapon",
    "Crush",
    "Bite",
    "Throw Rock",
    'Death From Above',
    'Find The Joint',
    'Grand Setup',
    'The Boot',
    'Face Smash',
    'Ready, Steady',
    'Thrill Seeker',
    'Elbow Drop',
    'Kick Away',
    'Leaping Clothesline'
];
