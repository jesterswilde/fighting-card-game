"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interface_1 = require("./interface");
const socket_1 = require("../shared/socket");
const Cards_1 = require("../cards/Cards");
const events_1 = require("./helpers/events");
const critical_1 = require("../gameServer/game/mechanics/critical");
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
            player.socket.emit(socket_1.SocketEnum.GOT_CARDS, processHandCard(cards));
        },
        sendState: (state) => {
            var stateToSend = {
                numPlayers: state.numPlayers,
                queue: processQueueCards(state.queue),
                health: state.health,
                block: state.block,
                playerStates: state.playerStates,
                distance: state.distance,
                setup: state.setup,
                predictions: state.predictions.map(pred => processPredictions(pred)),
                turnNumber: state.turnNumber,
                stateDurations: state.stateDurations,
            };
            console.log("Sending state", stateToSend);
            player.socket.emit(socket_1.SocketEnum.GOT_STATE, stateToSend);
        },
        sendEvents: (events) => {
            player.socket.emit(socket_1.SocketEnum.GOT_EVENTS, events_1.eventsToFrontend(events));
        },
        getPickOneChoice: (mechOnCard) => {
            return new Promise((res, rej) => {
                player.socket.emit(socket_1.SocketEnum.SHOULD_PICK_ONE, mechOnCard);
                player.socket.once(socket_1.SocketEnum.PICKED_ONE, (choice) => {
                    res(choice);
                });
            });
        },
        getPrediction: () => {
            player.socket.emit(socket_1.SocketEnum.SHOULD_PREDICT);
            return new Promise((res, rej) => {
                player.socket.once(socket_1.SocketEnum.MADE_PREDICTION, (prediction) => res(prediction));
            });
        },
        getUsedForceful: (mechOnCard) => {
            return new Promise((res, rej) => {
                player.socket.emit(socket_1.SocketEnum.GOT_FORCEFUL_CHOICE, mechOnCard);
                player.socket.once(socket_1.SocketEnum.PICKED_FORCEFUL, (useForceful) => {
                    res(useForceful);
                });
            });
        },
        getCardChoice: () => {
            return new Promise((res, rej) => {
                player.socket.once(socket_1.SocketEnum.PICKED_CARD, (num) => res(num));
            });
        },
        opponentMadeCardChoice: () => { },
    };
};
const processPredictions = (pred) => {
    if (pred)
        console.log("Processing pred", pred);
    if (!pred)
        return null;
    return {
        effects: pred.readiedEffects.map(reaEff => reaEff.effect)
    };
};
const processHandCard = (bothHands) => {
    return bothHands.map((hand) => {
        return hand.map((card) => {
            if (!card)
                return null;
            const handCard = {
                name: card.name,
            };
            critical_1.addCriticalToHandCard(card, handCard);
            //IMPLEMENT ADDING ENCHANCEMENTS AND BUFFS, THEY SHOUDL BE HANDLED IN THE MECHANICS FILE
            return handCard;
        });
    });
};
const processQueueCards = (queue) => {
    return queue.map((turn) => {
        return turn.map((playerCards) => {
            return playerCards.map(cardToQueueCard);
        });
    });
};
const cardToQueueCard = (card) => {
    const queueCard = {
        name: card.name,
    };
    const activeMechanics = [];
    if (card.telegraphs && card.telegraphs.length > 0)
        activeMechanics.push(...card.telegraphs.map((mech) => mech.index));
    if (card.focuses && card.focuses.length > 0)
        activeMechanics.push(...card.focuses.map((mech) => mech.index));
    if (activeMechanics.length > 0)
        queueCard.activeMechanics = activeMechanics;
    return queueCard;
};
