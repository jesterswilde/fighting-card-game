"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGame = void 0;
const disconnect_1 = require("./disconnect");
const game_1 = require("../game/game");
const util_1 = require("../util");
const stateMod_1 = require("./stateMod");
exports.createGame = async (players, gameMods = null) => {
    const state = makeGameState(players, gameMods);
    disconnect_1.handleDCDuringGame(players);
    game_1.playGame(state);
};
const makeGameState = (agents, mod = null) => {
    const { distance, playerStates } = stateMod_1.makePlayerStateWithMods(mod);
    const health = stateMod_1.healthFromMod(mod);
    const state = {
        agents,
        numPlayers: 2,
        queue: [],
        decks: agents.map(({ deck }) => deck),
        hands: [[], []],
        pickedCards: [],
        health,
        parry: [0, 0],
        block: [0, 0],
        playerStates,
        distance,
        stateDurations: [util_1.makeStateDurations(), util_1.makeStateDurations()],
        readiedEffects: [[], []],
        readiedMechanics: [[], []],
        readiedDamageEffects: [[], []],
        modifiedAxis: [util_1.makeModifiedAxis(), util_1.makeModifiedAxis()],
        predictions: [null, null],
        pendingPredictions: [],
        damaged: [false, false],
        setup: [0, 0],
        pendingSetup: [0, 0],
        tagModification: [{}, {}],
        tagsPlayed: [{}, {}],
        handSizeMod: [0, 0],
        nextHandSizeMod: [0, 0],
        turnNumber: 0,
        cardUID: 0,
        events: [],
        currentEvent: null
    };
    return state;
};
