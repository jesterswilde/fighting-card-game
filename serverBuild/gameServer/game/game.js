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
const cardInterface_1 = require("../interfaces/cardInterface");
const requirements_1 = require("./requirements");
const util_1 = require("../util");
const modifiedAxis_1 = require("./modifiedAxis");
const effectReducer_1 = require("./effectReducer");
const predictions_1 = require("./predictions");
const errors_1 = require("../errors");
const gameSettings_1 = require("../gameSettings");
const queue_1 = require("./queue");
const socket_1 = require("../interfaces/socket");
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
    sendState(state);
    state.sockets.forEach((socket, i) => {
        socket.emit(socket_1.SocketEnum.START_GAME, { player: i });
    });
};
const endGame = (state) => {
};
const sendState = (state) => {
    if (!state) {
        return;
    }
    const sendState = {
        playerStates: state.playerStates,
        stateDurations: state.stateDurations,
        block: state.block,
        queue: state.queue,
        distance: state.distance,
        currentPlayer: state.currentPlayer,
        health: state.health,
        damaged: state.damaged,
        predictions: state.pendingPredictions
    };
    state.sockets.forEach((socket, i) => {
        const playerState = util_1.deepCopy(sendState);
        if (playerState.predictions) {
            playerState.predictions.forEach((pred) => {
                if (pred.player !== i) {
                    pred.prediction = null;
                }
            });
        }
        socket.emit(socket_1.SocketEnum.GOT_STATE, playerState);
    });
};
exports.playTurn = (state) => __awaiter(this, void 0, void 0, function* () {
    sendState(state);
    yield exports.startTurn(state);
    yield exports.playCard(state);
    exports.endTurn(state);
});
exports.startTurn = (state) => __awaiter(this, void 0, void 0, function* () {
    exports.shuffleDeck(state);
    exports.drawHand(state);
    yield exports.playerPicksCard(state);
});
exports.endTurn = (state) => __awaiter(this, void 0, void 0, function* () {
    exports.cullQueue(state);
    decrementCounters(state);
    changePlayers(state);
    clearTurnData(state);
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
exports.drawHand = (state, { _sendHand = sendHand } = {}) => {
    const { decks, currentPlayer, hands } = state;
    const deck = decks[currentPlayer];
    let handIndexes = [];
    try {
        for (let i = 0; i < deck.length; i++) {
            if (requirements_1.canPlayCard(deck[i], state)) {
                handIndexes.push(i);
            }
            if (handIndexes.length === gameSettings_1.HAND_SIZE) {
                break;
            }
        }
        const hand = handIndexes.map((i) => {
            const card = deck[i];
            deck[i] = undefined;
            return card;
        });
        decks[currentPlayer] = decks[currentPlayer].filter((card) => card !== undefined);
        hands[currentPlayer] = hand;
        markOptional(hand, state);
        if (hand.length === 0) {
            addPanicCard(state);
        }
        _sendHand(state);
    }
    catch (err) {
        if (err === errors_1.ErrorEnum.NO_CARD) {
            console.log("No card", deck);
        }
    }
};
const markOptional = (cards, state) => {
    cards.forEach(({ optional = [], opponent }) => {
        optional.forEach((opt) => {
            opt.canPlay = requirements_1.canUseOptional(opt, opponent, state);
        });
    });
};
const addPanicCard = (state) => {
    const { currentPlayer: player } = state;
    const card = {
        name: 'Panic',
        effects: [],
        requirements: [],
        player,
        opponent: player === 0 ? 1 : 0,
        optional: []
    };
    state.hands[player].push(card);
};
const sendHand = (state) => {
    const { sockets, currentPlayer: player, hands } = state;
    sockets[player].emit(socket_1.SocketEnum.GOT_CARDS, hands[player]);
};
exports.playerPicksCard = (state) => __awaiter(this, void 0, void 0, function* () {
    const { sockets, currentPlayer: player } = state;
    return new Promise((res, rej) => {
        sockets[player].once(socket_1.SocketEnum.PICKED_CARD, (index) => {
            exports.pickCard(index, state);
            res();
        });
    });
});
exports.pickCard = (cardNumber, state) => {
    const { currentPlayer: player, hands, decks } = state;
    state.pickedCard = hands[player][cardNumber];
    const unusedCards = hands[player].filter((_, i) => i !== cardNumber);
    decks[player].push(...unusedCards);
    hands[player] = [];
    const opponent = state.currentPlayer === 0 ? 1 : 0;
    state.pickedCard.opponent = opponent;
};
exports.incrementQueue = (state) => {
    const { queue } = state;
    if (!state.incrementedQueue) {
        for (let i = queue.length - 1; i >= 0; i--) {
            queue[i + 1] = queue[i];
        }
        queue[0] = [];
        state.incrementedQueue = true;
    }
};
exports.addCardToQueue = (state) => {
    const { currentPlayer: player, queue } = state;
    const pickedCard = state.pickedCard;
    state.pickedCard = undefined;
    queue[0] = queue[0] || [];
    queue[0].push(pickedCard);
};
exports.shuffleDeck = (state, playerToShuffle) => {
    const { decks, currentPlayer: player } = state;
    const deck = decks[player];
    for (let i = 0; i < deck.length; i++) {
        const rand = Math.floor(Math.random() * deck.length);
        const temp = deck[rand];
        deck[rand] = deck[i];
        deck[i] = temp;
    }
};
exports.playCard = (state) => __awaiter(this, void 0, void 0, function* () {
    try {
        exports.getMechanicsReady(state);
        yield exports.makePredictions(state);
        exports.markAxisChanges(state);
        exports.incrementQueue(state);
        exports.addCardToQueue(state);
        exports.applyEffects(state);
        sendState(state);
    }
    catch (err) {
        console.log("err", err);
        if (err === errors_1.ControlEnum.PLAY_CARD) {
            console.log('caught and playing card');
            yield exports.playCard(state);
        }
        else {
            throw err;
        }
    }
});
exports.getMechanicsReady = (state) => {
    const { optional = [], effects = [] } = state.pickedCard;
    const validOptEff = optional.filter((reqEff) => requirements_1.canUseOptional(reqEff, state.pickedCard.opponent, state))
        .reduce((effsArr, reqEffs) => {
        effsArr.push(...reqEffs.effects);
        return effsArr;
    }, []);
    state.readiedEffects = [...util_1.deepCopy(effects), ...util_1.deepCopy(validOptEff)];
};
exports.makePredictions = (state, { _getPredictions = getPredictions } = {}) => __awaiter(this, void 0, void 0, function* () {
    const { readiedEffects = [] } = state;
    for (let i = 0; i < readiedEffects.length; i++) {
        const eff = readiedEffects[i];
        if (eff.mechanic === cardInterface_1.MechanicEnum.PREDICT) {
            const prediction = {};
            prediction.prediction = yield _getPredictions(state);
            prediction.mechanics = util_1.deepCopy(eff.mechanicEffects);
            prediction.player = state.currentPlayer;
            state.predictions = state.predictions || [];
            state.predictions.push(prediction);
            console.log('prediction: ', state.predictions);
        }
    }
});
const getPredictions = (state) => {
    console.log('getting predictin');
    return new Promise((res, rej) => {
        const { currentPlayer: player, sockets } = state;
        const socket = sockets[player];
        socket.emit(socket_1.SocketEnum.SHOULD_PREDICT);
        socket.once(socket_1.SocketEnum.MADE_PREDICTION, (prediction) => {
            console.log('gotPrediction');
            res(prediction);
        });
    });
};
exports.markAxisChanges = (state) => {
    const card = state.pickedCard;
    if (state.readiedEffects) {
        state.readiedEffects.forEach((mechanic) => {
            modifiedAxis_1.markAxisChange(mechanic, card, state);
        });
    }
};
/*
    --- TODO ---
    if a telegraph adds a focus or some other effect that lives on the queue, that new effect should be
    it's own entity on the queue. This is not handled in any way currently.
    smimilarly, if the card is undefined, we don't handle this at all. Will crash.
*/
exports.applyEffects = (state) => {
    try {
        exports.makeEffectsReduceable(state);
        exports.removeStoredEffects(state);
        exports.checkForVictor(state);
        exports.checkPredictions(state);
        exports.checkTelegraph(state);
        exports.checkReflex(state);
        exports.checkFocus(state);
    }
    catch (err) {
        if (err === errors_1.ControlEnum.NEW_EFFECTS) {
            exports.applyEffects(state);
        }
        else {
            throw (err);
        }
    }
};
exports.makeEffectsReduceable = (state) => {
    const card = queue_1.getLastPlayedCard(state);
    effectReducer_1.reduceMechanics(state.readiedEffects, card, state.currentPlayer, card.opponent, state);
};
exports.removeStoredEffects = (state) => {
    state.readiedEffects = undefined;
};
exports.checkForVictor = (state) => {
    const { health } = state;
    if (health.every((hp) => hp <= 0)) {
        state.winner = -1;
    }
    else if (health[0] <= 0) {
        state.winner = 1;
    }
    else if (health[1] <= 0) {
        state.winner = 0;
    }
    if (state.winner !== undefined) {
        throw errors_1.ControlEnum.GAME_OVER;
    }
};
exports.checkPredictions = (state) => {
    const { pendingPredictions: predictions } = state;
    let stateChanged = false;
    if (predictions) {
        predictions.forEach((pred) => {
            if (predictions_1.didPredictionHappen(pred, state)) {
                stateChanged = true;
                state.readiedEffects = state.readiedEffects || [];
                state.readiedEffects.push(...util_1.deepCopy(pred.mechanics));
            }
        });
        state.pendingPredictions = undefined;
    }
    if (stateChanged) {
        throw errors_1.ControlEnum.NEW_EFFECTS;
    }
};
exports.checkTelegraph = (state) => {
    const { queue } = state;
    const recentCard = queue_1.getLastPlayedCard(state);
    let readied = [];
    queue.forEach((cards = []) => {
        cards.forEach((card) => {
            if (card !== recentCard && card) {
                let telegraphs = card.telegraphs || [];
                const metTelegraphs = telegraphs.map((mech) => requirements_1.mechReqsMet(mech, card.opponent, card.player, state));
                if (metTelegraphs.length > 0) {
                    telegraphs.filter((_, i) => metTelegraphs[i])
                        .forEach((mech) => readied.push(...mech.mechanicEffects));
                    card.telegraphs = telegraphs.filter((_, i) => !metTelegraphs[i]);
                }
                if (card.telegraphs && card.telegraphs.length === 0) {
                    card.telegraphs = undefined;
                }
            }
        }, state);
    });
    if (readied.length > 0) {
        state.readiedEffects = util_1.deepCopy(readied);
        throw errors_1.ControlEnum.NEW_EFFECTS;
    }
};
exports.checkReflex = (state) => {
    const { queue } = state;
    let playerToReflex = null;
    queue.forEach((cards) => {
        cards.forEach((card) => {
            if (card.shouldReflex && playerToReflex === null) {
                playerToReflex = card.player;
                card.shouldReflex = undefined;
            }
        }, state);
    });
    if (playerToReflex !== null) {
        reflexCard(playerToReflex, state);
    }
};
const reflexCard = (player, state) => {
    console.log('reflexing');
    const deck = state.decks[player];
    exports.shuffleDeck(state, player);
    const cardIndex = deck.findIndex((card) => requirements_1.canPlayCard(card, state));
    if (cardIndex >= 0) {
        console.log('found card');
        const card = deck[cardIndex];
        state.decks[player] = deck.filter((card, i) => cardIndex !== i);
        card.opponent = card.player === 0 ? 1 : 0;
        state.pickedCard = card;
        console.log(card.name);
        throw errors_1.ControlEnum.PLAY_CARD;
    }
    else {
        console.log('reflexed into nothing');
    }
};
exports.checkFocus = (state) => {
    if (state.checkedFocus) {
        return;
    }
    const { queue, currentPlayer: player } = state;
    state.checkedFocus = true;
    let modifiedState = false;
    queue.forEach((cards = []) => {
        cards.forEach((card) => {
            if (card.focuses && card.player === player) {
                console.log('card has focus');
                const focused = card.focuses
                    .filter((mech) => requirements_1.mechReqsMet(mech, card.opponent, card.player, state))
                    .reduce((arr, mech) => {
                    arr.push(...mech.mechanicEffects);
                    return arr;
                }, []);
                if (focused.length > 0) {
                    modifiedState = true;
                    state.readiedEffects = state.readiedEffects || [];
                    state.readiedEffects.push(...util_1.deepCopy(focused));
                    modifiedState = true;
                }
            }
        });
    });
    if (modifiedState) {
        throw errors_1.ControlEnum.NEW_EFFECTS;
    }
};
exports.cullQueue = (state) => {
    const { decks, queue } = state;
    if (queue.length > gameSettings_1.QUEUE_LENGTH) {
        const cards = queue.pop();
        cards.forEach((card) => {
            console.log('culling', card.name, card.player);
            if (card.name !== 'Panic') {
                decks[card.player].push(card);
            }
        });
    }
};
const decrementCounters = (state) => {
    const { stateDurations, playerStates } = state;
    stateDurations.forEach((duration, i) => {
        if (duration.balance !== null && duration.balance !== undefined) {
            duration.balance--;
            if (duration.balance <= 0) {
                duration.balance = null;
                playerStates[i].balance = stateInterface_1.BalanceEnum.BALANCED;
            }
        }
        if (duration.motion !== null && duration.motion !== undefined) {
            duration.motion--;
            if (duration.motion <= 0) {
                duration.motion = null;
                playerStates[i].motion = stateInterface_1.MotionEnum.MOVING;
            }
        }
        if (duration.standing !== null && duration.standing !== undefined) {
            duration.standing--;
            if (duration.standing <= 0) {
                duration.standing = null;
                playerStates[i].standing = stateInterface_1.StandingEnum.STANDING;
            }
        }
    });
};
const changePlayers = (state) => {
    const player = state.currentPlayer === 0 ? 1 : 0;
    state.currentPlayer = player;
};
const clearTurnData = (state) => {
    state.damaged = [false, false];
    state.turnIsOver = false;
    state.modifiedAxis = util_1.makeModifiedAxis();
    state.turnIsOver = false;
    state.incrementedQueue = false;
    state.pendingPredictions = state.predictions;
    state.predictions = undefined;
};
