"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cardInterface_1 = require("./interfaces/cardInterface");
const stateInterface_1 = require("./interfaces/stateInterface");
exports.deepCopy = (obj) => {
    if (null == obj || "object" != typeof obj)
        return obj;
    const copy = obj.constructor();
    for (const attr in obj) {
        if (typeof obj[attr] === 'object') {
            copy[attr] = exports.deepCopy(obj[attr]);
        }
        else {
            copy[attr] = obj[attr];
        }
    }
    return copy;
};
exports.makeBlankCard = () => {
    return {
        requirements: [],
        effects: [],
        name: 'blankCard',
        optional: [],
    };
};
exports.makeRequirement = () => {
    return {
        axis: cardInterface_1.AxisEnum.CLOSE,
        player: cardInterface_1.PlayerEnum.BOTH,
        amount: 0,
    };
};
exports.makeMechanic = () => {
    return {
        axis: cardInterface_1.AxisEnum.FAR,
        player: cardInterface_1.PlayerEnum.OPPONENT,
        mechanic: null,
        amount: 0
    };
};
exports.makeGameState = () => {
    return {
        currentPlayer: 0,
        playerStates: [makePlayerState(), makePlayerState()],
        stateDurations: [makeStateDurations(), makeStateDurations()],
        block: [0, 0],
        queues: [[], []],
        distance: stateInterface_1.DistanceEnum.FAR,
        decks: [],
        damaged: [],
        hands: [],
        health: [],
        readiedEffects: [],
        modifiedAxis: makeModifiedAxis()
    };
};
const makeModifiedAxis = () => {
    return {
        balance: false,
        distance: false,
        motion: false,
        standing: false
    };
};
const makeStateDurations = () => {
    return {
        standing: null,
        motion: null,
        balance: null
    };
};
const makePlayerState = () => {
    return {
        standing: stateInterface_1.StandingEnum.STANDING,
        motion: stateInterface_1.MotionEnum.STILL,
        balance: stateInterface_1.BalanceEnum.BALANCED
    };
};
exports.playerEnumToPlayerArray = (playerEnum, player, opponent) => {
    let whoToCheck;
    if (playerEnum === cardInterface_1.PlayerEnum.PLAYER) {
        whoToCheck = [player];
    }
    else if (playerEnum === cardInterface_1.PlayerEnum.OPPONENT) {
        whoToCheck = [opponent];
    }
    else {
        whoToCheck = [player, opponent];
    }
    return whoToCheck;
};
exports.getLastPlayedCard = (state) => {
    const { queues, currentPlayer: player } = state;
    const queue = queues[player];
    const index = queue[player].length - 1;
    if (index < 0) {
        return null;
    }
    return queue[player][index];
};
