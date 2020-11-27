"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeHumanAgent = void 0;
const interface_1 = require("./interface");
const socket_1 = require("../shared/socket");
const Cards_1 = require("../cards/Cards");
const events_1 = require("./helpers/events");
const critical_1 = require("../gameServer/game/mechanics/critical");
const enhance_1 = require("../gameServer/game/mechanics/enhance");
const buff_1 = require("../gameServer/game/mechanics/buff");
exports.makeHumanAgent = (player, deckList = null) => {
    let index = -1;
    deckList = deckList == null ? player.deck.deckList : deckList;
    return {
        deck: Cards_1.deckListToCards(deckList),
        username: player.username,
        type: interface_1.AgentType.HUMAN,
        player,
        startGame: (_index) => {
            index = _index;
            player.socket.emit(socket_1.SocketEnum.START_GAME, { player: index });
        },
        gameOver: (didWin, state) => {
            player.socket.emit(socket_1.SocketEnum.GAME_OVER, { didWin, state: toSendState(state) });
        },
        sendHand: (cards) => {
            player.socket.emit(socket_1.SocketEnum.GOT_CARDS, processHandCard(cards));
        },
        sendState: (state) => {
            player.socket.emit(socket_1.SocketEnum.GOT_STATE, toSendState(state));
        },
        sendEvents: (events) => {
            console.log("Sending events", events);
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
const toSendState = (state) => {
    return {
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
};
const processPredictions = (pred) => {
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
            const enhanceEffects = enhance_1.makeEffectsFromEnhance(card);
            const buffedEffs = buff_1.makeEffectsFromBuff(card);
            const appendedEffects = [...enhanceEffects, ...buffedEffs];
            if (appendedEffects.length > 0)
                handCard.appendedEffects = appendedEffects;
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
