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
exports.createGame = (player1, player2) => __awaiter(this, void 0, void 0, function* () {
    const players = [player1, player2];
    disconnect_1.handleDCDuringGame(players);
    const state = makeGameState(players);
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
        health: [STARTING_HEALTH, STARTING_HEALTH],
        parry: [0, 0],
        block: [0, 0],
        playerStates: [makePlayerState(), makePlayerState()],
        distance: DistanceEnum.FAR,
        stateDurations: [makeStateDurations(), makeStateDurations()],
        readiedEffects: [[], []],
        damageEffects: [[], []],
        modifiedAxis: [makeModifiedAxis(), makeModifiedAxis()],
        predictions: [],
        pendingPredictions: [],
        damaged: [false, false],
        setup: [0, 0],
        pendingSetup: [0, 0],
        tagModification: [{}, {}],
        tagsPlayed: [{}, {}],
        handSizeMod: 0,
        nextHandSizeMod: 0,
        turnNumber: 0,
        cardUID: 0,
        events: [],
    };
    return state;
};
