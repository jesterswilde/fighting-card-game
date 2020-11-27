"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkReflex = exports.markShouldReflexOnQueueCard = void 0;
const errors_1 = require("../../errors");
const queue_1 = require("../queue");
const drawCards_1 = require("../drawCards");
/*
    Reflex is the where you you play the first valid card, after the effects of first card are resolved

*/
exports.markShouldReflexOnQueueCard = (effect, card, player, opponent, state) => {
    card.shouldReflex = true;
};
exports.checkReflex = (state) => {
    const reflexingCards = getReflexingCards(state);
    const shouldReflex = reflexingCards.some(should => should !== null);
    if (shouldReflex) {
        console.log("player to reflex", reflexingCards);
        let didReflex = false;
        reflexingCards.forEach((reflexingCardName, player) => {
            if (reflexingCardName !== null) {
                didReflex = true;
                reflexCard(player, state);
            }
        });
        if (didReflex) {
            console.log("did reflex");
            throw errors_1.ControlEnum.PLAY_CARD;
        }
    }
};
const getReflexingCards = (state) => {
    let cardsToReflex = state.readiedEffects.map(() => null);
    queue_1.forEachCardInQueue(state, card => {
        //Cards are reflexed one at a time, so even if 2 cards tell you to reflex, you only do it once.
        //But you will then restart the check loop, which will cause the next card to reflex.
        if (card.shouldReflex && !cardsToReflex[card.player]) {
            console.log("card name: ", card.name, " | ", card.player);
            cardsToReflex[card.player] = card.name;
            card.shouldReflex = undefined;
        }
    });
    return cardsToReflex;
};
const reflexCard = (player, state) => {
    console.log("reflexing");
    const hand = drawCards_1.drawCards(player, state, 1);
    if (hand.length > 0) {
        state.pickedCards[player] = hand[0];
        console.log("reflexed into", hand[0].name);
        return hand[0].name;
    }
    else {
        console.log("reflexed into nothing");
        return null;
    }
};
