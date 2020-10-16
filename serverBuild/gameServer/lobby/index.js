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
const socket_1 = require("../../shared/socket");
const auth_1 = require("../../auth");
const validation_1 = require("../../decks/validation");
const error_1 = require("../../error");
const disconnect_1 = require("./disconnect");
const queue_1 = require("./queue");
const game_1 = require("./game");
const human_1 = require("../../agent/human");
const random_1 = require("../../agent/random");
exports.default = (io) => {
    io.on("connection", configureSocket);
};
const configureSocket = (socket) => __awaiter(this, void 0, void 0, function* () {
    try {
        socket.emit(null);
        const player = yield makePlayerObject(socket);
        yield playerChoosesDeck(player);
        // joinLobby(player); //NEED SWITCH STATEMENT HERE,
        playAgainstAI(player);
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
const playAgainstAI = (player) => __awaiter(this, void 0, void 0, function* () {
    game_1.createGame([human_1.makeHumanAgent(player), random_1.makeRandomAgent()]);
});
const joinLobby = (player) => __awaiter(this, void 0, void 0, function* () {
    disconnect_1.handleDCDuringLobby(player);
    player.socket.emit(socket_1.SocketEnum.JOINED_LOBBY);
    queue_1.addToLobbyQueue(player);
});
