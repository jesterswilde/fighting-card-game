"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../errors");
const queue_1 = require("../queue");
const card_1 = require("../../../shared/card");
const drawCards_1 = require("../drawCards");
exports.checkReflex = (state) => {
    const reflexingPlayers = getReflexingPlayers(state);
    const shouldReflex = reflexingPlayers.some((should) => should);
    if (shouldReflex) {
        console.log("player to reflex", reflexingPlayers);
        let didReflex = false;
        reflexingPlayers.forEach((playerWillReflex, player) => {
            if (playerWillReflex) {
                didReflex = true;
                reflexCard(player, state);
            }
        });
        if (didReflex) {
            console.log('did reflex');
            throw errors_1.ControlEnum.PLAY_CARD;
        }
    }
};
const getReflexingPlayers = (state) => {
    const { readiedEffects = [] } = state;
    let playersToReflex = state.readiedEffects.map(() => false);
    queue_1.forEachCardInQueue(state, (card) => {
        const playerEffects = readiedEffects[card.player];
        if (card.shouldReflex && !playersToReflex[card.player]) {
            playerEffects.push({ card, mechanic: { mechanic: card_1.MechanicEnum.REFLEX }, isEventOnly: true, isHappening: true });
            console.log("card name: ", card.name, " | ", card.player);
            playersToReflex[card.player] = true;
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
        return true;
    }
    else {
        console.log('reflexed into nothing');
        return false;
    }
};
