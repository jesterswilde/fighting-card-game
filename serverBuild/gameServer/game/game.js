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
const errors_1 = require("../errors");
const socket_1 = require("../../shared/socket");
const socket_2 = require("./socket");
const playCard_1 = require("./playCards/playCard");
const startTurn_1 = require("./startTurn");
const endTurn_1 = require("./endTurn");
const util_1 = require("../util");
const endGame_1 = require("./endGame");
exports.playGame = (state) => __awaiter(this, void 0, void 0, function* () {
    try {
        startGame(state);
        while (true) {
            yield exports.playTurn(state);
        }
    }
    catch (err) {
        if (err === errors_1.ControlEnum.GAME_OVER) {
            endGame_1.endGame(state);
        }
        else {
            console.error(err);
        }
    }
});
const startGame = (state) => {
    console.log("Game starting", state);
    assignPlayerToDecks(state);
    socket_2.sendState(state);
    state.sockets.forEach((socket, i) => {
        socket.emit(socket_1.SocketEnum.START_GAME, { player: i });
    });
};
exports.playTurn = (state) => __awaiter(this, void 0, void 0, function* () {
    socket_2.sendState(state);
    yield startTurn_1.startTurn(state);
    yield playCard_1.playCards(state);
    endTurn_1.endTurn(state);
});
const assignPlayerToDecks = (state) => {
    for (let player = 0; player < state.decks.length; player++) {
        const deck = state.decks[player];
        for (let i = 0; i < deck.length; i++) {
            if (typeof deck[i] !== 'object') {
                console.log("Missing card", deck[i]);
            }
            else {
                deck[i].player = player;
                deck[i].opponent = util_1.getOpponent(player);
                deck[i].id = state.cardUID++;
            }
        }
    }
};
