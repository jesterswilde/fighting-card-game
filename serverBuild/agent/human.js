"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interface_1 = require("./interface");
const socket_1 = require("../shared/socket");
const Cards_1 = require("../cards/Cards");
exports.makeHumanAgent = (player) => {
    return {
        deck: Cards_1.deckListToCards(player.deck.deckList),
        username: player.username,
        type: interface_1.AgentType.HUMAN,
        player,
        startGame(index) {
            player.socket.emit(socket_1.SocketEnum.START_GAME, { player: index });
        },
        sendHand(cards) {
            player.socket.emit(socket_1.SocketEnum.GOT_CARDS, cards);
        },
        sendState(gameState) {
            player.socket.emit(socket_1.SocketEnum.GOT_STATE, gameState);
        },
        sendEvents(events) {
            player.socket.emit(socket_1.SocketEnum.GOT_EVENTS, events);
        },
        getPickOneChoice(cardName, mechIndex) {
            return new Promise((res, rej) => {
                player.socket.emit(socket_1.SocketEnum.SHOULD_PICK_ONE, { cardName, mechIndex });
                player.socket.emit(socket_1.SocketEnum.PICKED_ONE, (choice) => {
                    res(choice);
                });
            });
        },
        getPrediction(cardName, mechIndex) {
            return new Promise((res, rej) => {
                player.socket.emit(socket_1.SocketEnum.SHOULD_PREDICT, { cardName, mechIndex });
                player.socket.once(socket_1.SocketEnum.MADE_PREDICTION, (prediction) => {
                    res(prediction);
                });
            });
        },
        getUsedForceful(cardName, mechIndex) {
            return new Promise((res, rej) => {
                player.socket.emit(socket_1.SocketEnum.GOT_FORCEFUL_CHOICE, { cardName, mechIndex });
                player.socket.once(socket_1.SocketEnum.PICKED_FORCEFUL, (useForceful) => {
                    res(useForceful);
                });
            });
        }
    };
};
