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
const disconnect_1 = require("./disconnect");
const game_1 = require("../game/game");
const stateInterface_1 = require("../interfaces/stateInterface");
const gameSettings_1 = require("../gameSettings");
const util_1 = require("../util");
exports.createGame = (players) => __awaiter(this, void 0, void 0, function* () {
    const state = makeGameState(players);
    disconnect_1.handleDCDuringGame(players);
    game_1.playGame(state);
});
const makeGameState = (agents) => {
    const state = {
        agents,
        numPlayers: 2,
        queue: [],
        decks: agents.map(({ deck }) => deck),
        hands: [[], []],
        pickedCards: [],
        health: [gameSettings_1.STARTING_HEALTH, gameSettings_1.STARTING_HEALTH],
        parry: [0, 0],
        block: [0, 0],
        playerStates: [util_1.makePlayerState(), util_1.makePlayerState()],
        distance: stateInterface_1.DistanceEnum.FAR,
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
