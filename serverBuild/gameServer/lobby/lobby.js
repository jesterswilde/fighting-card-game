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
const stateInterface_1 = require("../interfaces/stateInterface");
const gameSettings_1 = require("../gameSettings");
const util_1 = require("../util");
const socket_1 = require("../../shared/socket");
const game_1 = require("../game/game");
const auth_1 = require("../../auth");
const validation_1 = require("../../decks/validation");
const error_1 = require("../../error");
const interface_1 = require("../../agent/interface");
let queue = [];
exports.default = (io) => {
    io.on("connection", configureSocket);
};
const joinLobby = (player) => __awaiter(this, void 0, void 0, function* () {
    handleDCDuringLobby(player.socket);
    player.socket.emit(socket_1.SocketEnum.JOINED_LOBBY);
    console.log("Joined lobby");
    if (queue.length > 0) {
        createGame(queue.shift(), player);
    }
    else {
        queue.push(player);
    }
    console.log(`Queue Length: ${queue.length}`);
});
const configureSocket = (socket) => __awaiter(this, void 0, void 0, function* () {
    try {
        socket.emit(null);
        const player = yield makePlayerObject(socket);
        yield playerChoosesDeck(player);
        joinLobby(player);
    }
    catch (err) {
        if ((err = error_1.ErrorEnum.CARDS_ARENT_IN_STYLES)) {
            console.log(`Error in lobby ${err}`);
            socket.emit(socket_1.SocketEnum.PLAYER_SENT_BAD_INFO, err);
            socket.disconnect();
        }
    }
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
    const state = makeGameState(players);
    game_1.playGame(state);
});
const handleDCDuringGame = (players) => {
    players.forEach((agent) => {
        if (agent.type === interface_1.AgentType.HUMAN) {
        }
    });
};
const handleDCDuringLobby = (dcSocket) => {
    dcSocket.removeAllListeners("disconnect");
    dcSocket.on("disconnect", (e) => {
        console.log("Disconnecting", e);
        queue = queue.filter((playerObject) => playerObject.socket !== dcSocket);
    });
};
//This is unity version, now that decks are stored locally.
const playerChoosesDeck = (player) => __awaiter(this, void 0, void 0, function* () {
    return new Promise((res, rej) => {
        player.socket.emit(socket_1.SocketEnum.PLAYER_SHOULD_CHOSE_DECK);
        player.socket.once(socket_1.SocketEnum.PICKED_DECK, (deck) => {
            if (!validation_1.areCardsInStyles(deck.styles, deck.deckList)) {
                rej(error_1.ErrorEnum.CARDS_ARENT_IN_STYLES);
            }
            else {
                player.deck = deck;
                res();
            }
        });
    });
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
        damageEffects: [[], []],
        modifiedAxis: [util_1.makeModifiedAxis(), util_1.makeModifiedAxis()],
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
