"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../errors");
const queue_1 = require("../queue");
const drawCards_1 = require("../drawCards");
const events_1 = require("../events");
exports.checkReflex = (state) => {
    const reflexingCards = getReflexingPlayers(state);
    const shouldReflex = reflexingCards.some((should) => should !== null);
    if (shouldReflex) {
        console.log("player to reflex", reflexingCards);
        let didReflex = false;
        reflexingCards.map((playerWillReflex, player) => {
            if (playerWillReflex) {
                didReflex = true;
                reflexCard(player, state);
            }
        });
        if (didReflex) {
            events_1.addReflexEffects(reflexingCards, state);
            console.log('did reflex');
            throw errors_1.ControlEnum.PLAY_CARD;
        }
    }
};
const getReflexingPlayers = (state) => {
    const { readiedEffects = [] } = state;
    let playersToReflex = state.readiedEffects.map(() => null);
    queue_1.forEachCardInQueue(state, (card) => {
        if (card.shouldReflex && !playersToReflex[card.player]) {
            console.log("card name: ", card.name, " | ", card.player);
            playersToReflex[card.player] = card.name;
            card.shouldReflex = undefined;
        }
    });
    return playersToReflex;
};
const reflexCard = (player, state) => {
    console.log('reflexing');
    const hand = drawCards_1.drawCards(player, state, 1);
    if (hand.length > 0) {
        state.pickedCards[player] = hand[0];
        console.log('reflexed into', hand[0].name);
        return hand[0].name;
    }
    else {
        console.log('reflexed into nothing');
        return null;
    }
};
