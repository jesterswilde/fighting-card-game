"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqByReverse = exports.splitArray = exports.playerEnumToPlayerArray = exports.makeStateDurations = exports.makeModifiedAxis = exports.makeEffect = exports.makeRequirement = exports.makeBlankCard = exports.deepCopy = exports.getOpponent = void 0;
const card_1 = require("../shared/card");
exports.getOpponent = (player) => {
    return player === 1 ? 0 : 1;
};
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
        mechanics: []
    };
};
exports.makeRequirement = () => {
    return {
        axis: card_1.AxisEnum.CLOSE,
        player: card_1.PlayerEnum.BOTH,
    };
};
exports.makeEffect = () => {
    return {
        axis: card_1.AxisEnum.FAR,
        player: card_1.PlayerEnum.OPPONENT,
        amount: 0
    };
};
/*
export const makeTestingGameState = (): GameState => {
    return {
        agents: [],
        numPlayers: 2,
        playerStates: [makePlayerState(), makePlayerState()],
        stateDurations: [makeStateDurations(), makeStateDurations()],
        parry: [0, 0],
        block: [0, 0],
        queue: [[], []],
        pickedCards: [],
        distance: DistanceEnum.FAR,
        decks: [],
        damaged: [],
        hands: [],
        tagModification: [{}, {}],
        tagsPlayed: [{},{}],
        health: [],
        readiedEffects: [],
        readiedDamageEffects: [],
        modifiedAxis: [makeModifiedAxis(),makeModifiedAxis()],
        events: [],
        setup: [0,0],
        pendingSetup: [0,0],
        turnNumber: 0,
        cardUID: 0,
        predictions: [],
        pendingPredictions: [],
    }
}*/
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
exports.playerEnumToPlayerArray = (playerEnum, player, opponent) => {
    let whoToCheck;
    if (playerEnum === card_1.PlayerEnum.PLAYER) {
        whoToCheck = [player];
    }
    else if (playerEnum === card_1.PlayerEnum.OPPONENT) {
        whoToCheck = [opponent];
    }
    else {
        whoToCheck = [player, opponent];
    }
    return whoToCheck;
};
/** returns an array where the first index is an array of all elements that matche the filter, and the second doesn't. Both will return empty arrays if no matches (not null) */
exports.splitArray = (arr, filter) => {
    const matches = arr.filter(filter);
    const noMatch = arr.filter((value) => !filter(value));
    return [matches, noMatch];
};
exports.uniqByReverse = (arr, by) => {
    const values = {};
    const reverseArr = [];
    for (let i = arr.length - 1; i >= 0; i--) {
        const item = arr[i];
        const key = by(item);
        if (!values[key]) {
            values[key] = true;
            reverseArr.push(item);
        }
    }
    return reverseArr.reverse();
};
