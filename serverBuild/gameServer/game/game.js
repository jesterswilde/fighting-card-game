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
const cardInterface_1 = require("../interfaces/cardInterface");
const requirements_1 = require("./requirements");
const util_1 = require("../util");
const modifiedAxis_1 = require("./modifiedAxis");
const effectReducer_1 = require("./effectReducer");
exports.playGame = (state) => __awaiter(this, void 0, void 0, function* () {
    startGame(state);
    while (state.winner === undefined) {
        yield exports.playTurn(state);
    }
    endGame(state);
});
const startGame = (state) => {
};
const endGame = (state) => {
};
exports.playTurn = (state) => __awaiter(this, void 0, void 0, function* () {
    yield exports.startTurn(state);
    while (!state.turnIsOver) {
        yield exports.playCard(state);
    }
    exports.endTurn(state);
});
exports.startTurn = (state) => __awaiter(this, void 0, void 0, function* () {
    exports.shuffleDeck(state);
    exports.drawHand(state);
    yield exports.playerPicksCard(state);
});
exports.endTurn = (state) => __awaiter(this, void 0, void 0, function* () {
    state.turnIsOver = false;
});
exports.drawHand = (state) => {
    const { decks, currentPlayer, hands } = state;
    const deck = decks[currentPlayer];
    let handIndexes = [];
    for (let i = 0; i < deck.length; i++) {
        if (requirements_1.canPlayCard(deck[i], state)) {
            handIndexes.push(i);
        }
        if (handIndexes.length === 3) {
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
};
exports.playerPicksCard = (state) => __awaiter(this, void 0, void 0, function* () {
});
exports.pickCard = (cardNumber, state) => {
    const { currentPlayer: player, hands, decks } = state;
    state.pickedCard = hands[player][cardNumber];
    const unusedCards = hands[player].filter((_, i) => i !== cardNumber);
    decks[player].push(...unusedCards);
    hands[player] = [];
    const opponent = state.currentPlayer === 0 ? 1 : 0;
    state.pickedCard.opponent = opponent;
    state.pickedCard.player = state.currentPlayer;
};
exports.addCardToQueue = (state) => {
    const { currentPlayer: player, queues } = state;
    const queue = queues[player];
    const pickedCard = state.pickedCard;
    state.pickedCard = undefined;
    queue[0] = queue[0] || [];
    queue[0].push(pickedCard);
};
exports.incrementQueue = (state) => {
    const { queues, currentPlayer: player } = state;
    queues[player] = queues[player] || [];
    const queue = queues[player];
    for (let i = queue.length - 1; i >= 0; i--) {
        queue[i + 1] = queue[i];
    }
    queue[0] = [];
};
exports.shuffleDeck = (state) => {
    const { decks, currentPlayer } = state;
    const deck = decks[currentPlayer];
    for (let i = 0; i < deck.length; i++) {
        const rand = Math.floor(Math.random() * deck.length);
        const temp = deck[rand];
        deck[rand] = deck[i];
        deck[i] = temp;
    }
};
exports.playCard = (state) => __awaiter(this, void 0, void 0, function* () {
    exports.getMechanicsReady(state);
    yield exports.makePredictions(state);
    exports.markAxisChanges(state);
    exports.incrementQueue(state);
    exports.addCardToQueue(state);
    exports.applyEffects(state);
});
exports.getMechanicsReady = (state) => {
    const { optional = [], effects = [] } = state.pickedCard;
    const validOptEff = optional.filter((reqEff) => requirements_1.canUseOptional(reqEff, state.pickedCard.opponent, state))
        .reduce((effects, reqEffs) => {
        effects.push(...reqEffs.effects);
        return effects;
    }, []);
    state.pickedCard.stored = [...util_1.deepCopy(effects), ...util_1.deepCopy(validOptEff)];
};
exports.makePredictions = (state, { _getPredictions = getPredictions } = {}) => __awaiter(this, void 0, void 0, function* () {
    const { stored = [] } = state.pickedCard;
    for (let i = 0; i < stored.length; i++) {
        const eff = stored[i];
        if (eff.mechanic === cardInterface_1.MechanicEnum.PREDICT) {
            eff.prediction = yield _getPredictions();
        }
    }
});
const getPredictions = () => __awaiter(this, void 0, void 0, function* () {
    return cardInterface_1.PredictionEnum.NONE;
});
exports.markAxisChanges = (state) => {
    const card = state.pickedCard;
    if (card && card.stored) {
        card.stored.forEach((mechanic) => {
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
    const card = util_1.getLastPlayedCard(state);
    effectReducer_1.reduceMechanics(card.stored, card, state.currentPlayer, card.opponent, state);
};
exports.removeStoredEffects = (state) => {
};
exports.checkForVictor = (state) => {
};
exports.checkPredictions = (state) => {
};
