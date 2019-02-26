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
const socket_1 = require("./socket");
const requirements_1 = require("./requirements");
const gameSettings_1 = require("../gameSettings");
const errors_1 = require("../errors");
const socket_2 = require("../../shared/socket");
const util_1 = require("../util");
exports.startTurn = (state) => __awaiter(this, void 0, void 0, function* () {
    exports.shuffleDeck(state);
    exports.addPoise(state);
    exports.drawHand(state);
    socket_1.sendState(state);
    yield exports.playerPicksCard(state);
});
exports.addPoise = (state) => {
    const { currentPlayer: player, playerStates } = state;
    if (state.turnNumber !== 0 && playerStates[player].poise < gameSettings_1.ANTICIPATING_POISE - 1) {
        playerStates[player].poise++;
        console.log('increasing poise', state.playerStates[player].poise);
    }
};
exports.drawHand = (state, { _sendHand = socket_1.sendHand } = {}) => {
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
        else {
            throw err;
        }
    }
};
const markOptional = (cards, state) => {
    cards.forEach(({ optional = [], opponent, player }) => {
        if (opponent === undefined) {
            opponent = player === 0 ? 1 : 0;
        }
        optional.forEach((opt) => {
            opt.canPlay = requirements_1.canUseOptional(opt, player, opponent, state);
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
exports.playerPicksCard = (state) => __awaiter(this, void 0, void 0, function* () {
    const { sockets, currentPlayer: player } = state;
    const opponent = util_1.getOpponent(player);
    return new Promise((res, rej) => {
        sockets[player].once(socket_2.SocketEnum.PICKED_CARD, (index) => {
            exports.pickCard(index, state);
            sockets[opponent].emit(socket_2.SocketEnum.OPPONENT_PICKED_CARDS);
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
