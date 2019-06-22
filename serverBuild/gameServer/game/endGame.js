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
const events_1 = require("./events");
const socket_1 = require("./socket");
const socket_2 = require("../../shared/socket");
exports.endGame = (state) => {
    events_1.addGameOverEvent(state.winner, state);
    socket_1.sendState(state);
    events_1.sendEvents(state);
};
const sendGameOver = (state) => __awaiter(this, void 0, void 0, function* () {
    state.sockets.forEach((socket) => {
        socket.emit(socket_2.SocketEnum.GAME_OVER);
        socket.once(socket_2.SocketEnum.END_GAME_CHOICE, (choice) => {
            switch (choice) {
                case socket_2.GameOverEnum.FIND_NEW_OPP_WITH_NEW_DECK:
                    break;
                case socket_2.GameOverEnum.FIND_NEW_OPP_WITH_SAME_DECK:
                    break;
            }
        });
    });
});
