"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const send_1 = require("./send");
const errors_1 = require("../errors");
const gameSettings_1 = require("../gameSettings");
const requirements_1 = require("./playCards/requirements");
const util_1 = require("../util");
const enhance_1 = require("./mechanics/enhance");
const critical_1 = require("./mechanics/critical");
exports.givePlayersCards = (state, { _sendHand = send_1.sendHand } = {}) => {
    try {
        drawHands(state);
        critical_1.markCritical(state);
        enhance_1.addEnhacementsToHands(state);
        addPanicCard(state);
        _sendHand(state);
    }
    catch (err) {
        if (err === errors_1.ErrorEnum.NO_CARD) {
            console.error("No card");
        }
        else {
            throw err;
        }
    }
};
const drawHands = (state) => {
    const hands = state.decks.map((_, player) => {
        const hand = exports.drawCards(player, state);
        return hand;
    });
    state.hands = hands;
};
exports.drawCards = (player, state, defaultHandSize = gameSettings_1.HAND_SIZE) => {
    exports.shuffleDeck(player, state);
    const deck = state.decks[player];
    let handIndexes = [];
    const handSize = defaultHandSize + state.handSizeMod[player] || 0;
    for (let i = 0; i < deck.length; i++) {
        if (requirements_1.canPlayCard(deck[i], state)) {
            handIndexes.push(i);
        }
        if (handIndexes.length === handSize) {
            break;
        }
    }
    const hand = handIndexes.map((i) => {
        const card = deck[i];
        deck[i] = undefined;
        return card;
    });
    state.decks[player] = state.decks[player].filter((card) => card !== undefined);
    return hand;
};
const addPanicCard = (state) => {
    state.hands.forEach((hand, player) => {
        if (hand.length === 0) {
            const card = {
                name: 'Panic',
                effects: [],
                mechanics: [],
                requirements: [],
                player,
                opponent: util_1.getOpponent(player),
                id: state.cardUID++,
                isTemporary: true,
            };
            state.hands[player].push(card);
        }
    });
};
exports.shuffleDecks = (state) => {
    state.decks.forEach((deck, player) => exports.shuffleDeck(player, state));
};
exports.shuffleDeck = (player, state) => {
    const { decks } = state;
    const deck = decks[player];
    for (let i = 0; i < deck.length; i++) {
        const rand = Math.floor(Math.random() * deck.length);
        const temp = deck[rand];
        deck[rand] = deck[i];
        deck[i] = temp;
    }
};
