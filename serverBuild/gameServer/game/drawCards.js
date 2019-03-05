"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_1 = require("./socket");
const errors_1 = require("../errors");
const gameSettings_1 = require("../gameSettings");
const requirements_1 = require("./playCards/requirements");
const util_1 = require("../util");
exports.givePlayersCards = (state, { _sendHand = socket_1.sendHand } = {}) => {
    try {
        drawHands(state);
        markOptional(state);
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
exports.drawCards = (player, state, handSize = gameSettings_1.HAND_SIZE) => {
    exports.shuffleDeck(player, state);
    const deck = state.decks[player];
    let handIndexes = [];
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
        exports.addEnhancement(card, state);
        deck[i] = undefined;
        return card;
    });
    state.decks[player] = state.decks[player].filter((card) => card !== undefined);
    return hand;
};
const markOptional = (state) => {
    state.hands.forEach((hand) => {
        hand.forEach(({ optional = [], opponent, player }) => {
            if (opponent === undefined) {
                opponent = player === 0 ? 1 : 0;
            }
            optional.forEach((opt) => {
                opt.canPlay = requirements_1.canUseOptional(opt, player, opponent, state);
            });
        });
    });
};
exports.addEnhancement = (card, state) => {
    const tags = card.tags || [];
    const modObj = state.tagModification[card.player];
    card.enhancements = tags.reduce((enhArr, { value: tag }) => {
        const mechanics = modObj[tag] || [];
        enhArr.push({ tag, mechanics });
        return enhArr;
    }, []);
};
const addPanicCard = (state) => {
    state.hands.forEach((hand, player) => {
        if (hand.length === 0) {
            const card = {
                name: 'Panic',
                effects: [],
                requirements: [],
                player,
                opponent: util_1.getOpponent(player),
                optional: [],
                id: state.cardUID++
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
