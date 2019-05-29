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
const socket_1 = require("../shared/socket");
const premade_1 = require("../decks/premade");
const game_1 = require("./game/game");
const auth_1 = require("../auth");
const decks_1 = require("../decks");
let queue = [];
exports.default = (io) => {
    io.on('connection', configureSocket);
};
const joinLobby = (player) => __awaiter(this, void 0, void 0, function* () {
    console.log('joining lobby');
    handleDCDuringLobby(player.socket);
    player.socket.emit(socket_1.SocketEnum.JOINED_LOBBY);
    if (queue.length > 0) {
        console.log('starting game');
        createGame(queue[0], player);
        queue = [];
    }
    else {
        queue.push(player);
    }
});
const configureSocket = (socket) => __awaiter(this, void 0, void 0, function* () {
    const player = yield makePlayerObject(socket);
    joinLobby(player);
});
const makePlayerObject = (socket) => __awaiter(this, void 0, void 0, function* () {
    const token = socket.handshake.query.token;
    const username = yield auth_1.getVerifiedUsername(token);
    const player = { socket, username };
    return player;
});
const createGame = (player1, player2) => __awaiter(this, void 0, void 0, function* () {
    const players = [player1, player2];
    handleDCDuringGame(players);
    const deckPromises = players.map(playerPicksDeck);
    let decks = yield Promise.all(deckPromises);
    decks = decks.map((deck) => util_1.deepCopy(deck));
    console.log('all deck choices in');
    const state = makeGameState(players, decks);
    game_1.playGame(state);
});
const handleDCDuringGame = (players) => {
    players.forEach((playerObj) => {
        playerObj.socket.removeAllListeners('disconnect');
        playerObj.socket.on('disconnect', () => {
            console.log('disconnected during game');
            players.filter((otherPlayer) => otherPlayer !== playerObj).forEach(joinLobby);
        });
    });
};
const handleDCDuringLobby = (dcSocket) => {
    dcSocket.removeAllListeners('disconnect');
    dcSocket.on('disconnect', () => {
        console.log('disconnected during lobby');
        queue = queue.filter((playerObject) => playerObject.socket !== dcSocket);
    });
};
const playerPicksDeck = (player) => __awaiter(this, void 0, void 0, function* () {
    return new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
        const deckOptions = yield decks_1.getDeckOptions(player.username);
        player.socket.emit(socket_1.SocketEnum.GOT_DECK_OPTIONS, deckOptions);
        player.socket.once(socket_1.SocketEnum.PICKED_DECK, (index) => __awaiter(this, void 0, void 0, function* () {
            console.log('got deck choice');
            const deck = yield premade_1.getDeck(deckOptions[index]);
            res(deck);
        }));
    }));
});
const makeGameState = (players, decks) => {
    const state = {
        numPlayers: 2,
        usernames: players.map(({ username }) => username),
        sockets: players.map(({ socket }) => socket),
        queue: [],
        decks,
        hands: [[], []],
        pickedCards: [],
        health: [gameSettings_1.STARTING_HEALTH, gameSettings_1.STARTING_HEALTH],
        parry: [0, 0],
        block: [0, 0],
        playerStates: [util_1.makePlayerState(), util_1.makePlayerState()],
        distance: stateInterface_1.DistanceEnum.FAR,
        stateDurations: [util_1.makeStateDurations(), util_1.makeStateDurations()],
        readiedEffects: [[], []],
        damageEffects: [[], []],
        modifiedAxis: [util_1.makeModifiedAxis(), util_1.makeModifiedAxis()],
        predictions: [],
        pendingPredictions: [],
        damaged: [false, false],
        setup: [0, 0],
        pendingSetup: [0, 0],
        tagModification: [{}, {}],
        tagsPlayed: [{}, {}],
        lockedState: {
            distance: null,
            players: [
                { motion: null, poise: null, stance: null },
                { motion: null, poise: null, stance: null }
            ]
        },
        turnNumber: 0,
        cardUID: 0,
        events: []
    };
    return state;
};
