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
const socket_1 = require("../interfaces/socket");
const socket_2 = require("./socket");
const playCard_1 = require("./playCard");
const startTurn_1 = require("./startTurn");
const endTurn_1 = require("./endTurn");
exports.playGame = (state) => __awaiter(this, void 0, void 0, function* () {
    try {
        startGame(state);
        while (true) {
            yield exports.playTurn(state);
        }
    }
    catch (err) {
        if (err === errors_1.ControlEnum.GAME_OVER) {
            endGame(state);
        }
        else {
            console.error(err);
        }
    }
});
const startGame = (state) => {
    assignPlayerToDecks(state);
    socket_2.sendState(state);
    state.sockets.forEach((socket, i) => {
        socket.emit(socket_1.SocketEnum.START_GAME, { player: i });
    });
};
const endGame = (state) => {
    socket_2.sendState(state);
};
exports.playTurn = (state) => __awaiter(this, void 0, void 0, function* () {
    socket_2.sendState(state);
    yield startTurn_1.startTurn(state);
    yield playCard_1.playCard(state);
    endTurn_1.endTurn(state);
});
const assignPlayerToDecks = (state) => {
    for (let player = 0; player < state.decks.length; player++) {
        const deck = state.decks[player];
        for (let i = 0; i < deck.length; i++) {
            deck[i].player = player;
        }
        console.log(deck.map(({ player }) => player));
    }
};
