"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cardInterface_1 = require("./interfaces/cardInterface");
const stateInterface_1 = require("./interfaces/stateInterface");
const gameSettings_1 = require("./gameSettings");
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
        playerStates: [exports.makePlayerState(), exports.makePlayerState()],
        stateDurations: [exports.makeStateDurations(), exports.makeStateDurations()],
        block: [0, 0],
        queue: [[], []],
        distance: stateInterface_1.DistanceEnum.FAR,
        decks: [],
        damaged: [],
        hands: [],
        health: [],
        readiedEffects: [],
        modifiedAxis: exports.makeModifiedAxis(),
        sockets: [],
        events: [],
        turnNumber: 0,
        lockedState: {
            distance: null,
            players: [
                {
                    poise: null,
                    motion: null,
                    stance: null
                }, {
                    poise: null,
                    motion: null,
                    stance: null
                }
            ]
        }
    };
};
exports.makeModifiedAxis = () => {
    return {
        balance: false,
        distance: false,
        motion: false,
        standing: false
    };
};
exports.makeStateDurations = () => {
    return {
        standing: null,
        motion: null,
        balance: null
    };
};
exports.makePlayerState = () => {
    return {
        standing: stateInterface_1.StandingEnum.STANDING,
        motion: stateInterface_1.MotionEnum.STILL,
        poise: gameSettings_1.STARTING_POISE
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
