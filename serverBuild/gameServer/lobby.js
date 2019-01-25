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
const stateInterface_1 = require("./interfaces/stateInterface");
const gameSettings_1 = require("./gameSettings");
const util_1 = require("./util");
const socket_1 = require("./interfaces/socket");
const decks_1 = require("../decks");
const game_1 = require("./game/game");
let queue = [];
exports.default = (io) => {
    io.on('connection', joinLobby);
};
const joinLobby = (player) => {
    console.log('joining lobby');
    player.emit(socket_1.SocketEnum.JOINED_LOBBY);
    if (queue.length > 0) {
        console.log('starting game');
        createGame(queue[0], player);
        queue = [];
    }
    else {
        queue.push(player);
    }
};
const createGame = (player1, player2) => __awaiter(this, void 0, void 0, function* () {
    const players = [player1, player2];
    const deckPromises = players.map(playerPicksDeck);
    let decks = yield Promise.all(deckPromises);
    decks = decks.map((deck) => util_1.deepCopy(deck));
    console.log('all deck choices in');
    const state = makeGameState(players, decks);
    game_1.playGame(state);
});
const playerPicksDeck = (player) => {
    return new Promise((res, rej) => {
        const deckOptions = decks_1.getDeckOptions();
        player.emit(socket_1.SocketEnum.GOT_DECK_OPTIONS, deckOptions);
        player.once(socket_1.SocketEnum.PICKED_DECK, (index) => {
            console.log('got deck choice');
            const deck = decks_1.getDeck(deckOptions[index]);
            res(deck);
        });
    });
};
const makeGameState = (sockets, decks) => {
    const state = {
        sockets,
        decks,
        health: [gameSettings_1.STARTING_HEALTH, gameSettings_1.STARTING_HEALTH],
        currentPlayer: 0,
        playerStates: [util_1.makePlayerState(), util_1.makePlayerState()],
        stateDurations: [util_1.makeStateDurations(), util_1.makeStateDurations()],
        readiedEffects: [],
        modifiedAxis: util_1.makeModifiedAxis(),
        block: [0, 0],
        queue: [],
        distance: stateInterface_1.DistanceEnum.FAR,
        hands: [[], []],
        damaged: [false, false]
    };
    return state;
};
