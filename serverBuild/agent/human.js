"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interface_1 = require("./interface");
const socket_1 = require("../shared/socket");
const Cards_1 = require("../cards/Cards");
exports.makeHumanAgent = (player) => {
    let index = -1;
    return {
        deck: Cards_1.deckListToCards(player.deck.deckList),
        username: player.username,
        type: interface_1.AgentType.HUMAN,
        player,
        startGame: (_index) => {
            index = _index;
            player.socket.emit(socket_1.SocketEnum.START_GAME, { player: index });
        },
        gameOver: () => {
            player.socket.emit(socket_1.SocketEnum.GAME_OVER);
            player.socket.once(socket_1.SocketEnum.END_GAME_CHOICE, (choice) => {
                switch (choice) {
                    case socket_1.GameOverEnum.FIND_NEW_OPP_WITH_NEW_DECK:
                        break;
                    case socket_1.GameOverEnum.FIND_NEW_OPP_WITH_SAME_DECK:
                        break;
                }
            });
        },
        sendHand: (cards) => {
            player.socket.emit(socket_1.SocketEnum.GOT_CARDS, cards);
        },
        sendState: (state) => {
            player.socket.emit(socket_1.SocketEnum.GOT_STATE, {
                numPlayers: state.numPlayers,
                queue: processQueueCards(state.queue),
                health: state.health,
                block: state.block,
                playerStates: state.playerStates,
                distance: state.distance,
                setup: state.setup,
                predictions: state.predictions,
                turnNumber: state.turnNumber,
                stateDurations: state.stateDurations,
            });
        },
        sendEvents: (events) => {
            player.socket.emit(socket_1.SocketEnum.GOT_EVENTS, events);
        },
        getPickOneChoice: (cardName, mechIndex) => {
            return new Promise((res, rej) => {
                player.socket.emit(socket_1.SocketEnum.SHOULD_PICK_ONE, { cardName, mechIndex });
                player.socket.emit(socket_1.SocketEnum.PICKED_ONE, (choice) => {
                    res(choice);
                });
            });
        },
        getPrediction: () => {
            return new Promise((res, rej) => {
                player.socket.emit(socket_1.SocketEnum.SHOULD_PREDICT);
                player.socket.once(socket_1.SocketEnum.MADE_PREDICTION, (prediction) => {
                    res(prediction);
                });
            });
        },
        getUsedForceful: (cardName, mechIndex) => {
            return new Promise((res, rej) => {
                player.socket.emit(socket_1.SocketEnum.GOT_FORCEFUL_CHOICE, {
                    cardName,
                    mechIndex,
                });
                player.socket.once(socket_1.SocketEnum.PICKED_FORCEFUL, (useForceful) => {
                    res(useForceful);
                });
            });
        },
        getCardChoice: () => {
            return new Promise((res, rej) => { });
        },
        opponentMadeCardChoice: () => { },
    };
};
const processQueueCards = (queue) => {
    return [];
};
