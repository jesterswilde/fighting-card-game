"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../errors");
const queue_1 = require("../queue");
const drawCards_1 = require("../drawCards");
const card_1 = require("../../../shared/card");
const gameEvent_1 = require("../../interfaces/gameEvent");
/*
    Reflex is the where you you play the first valid card, after the effects of first card are resolved

*/
exports.reduceReflex = (mechanic, card, player, opponent, state) => {
    card.shouldReflex = true;
};
exports.checkReflex = (state) => {
    const reflexingCards = getReflexingPlayers(state);
    const shouldReflex = reflexingCards.some(should => should !== null);
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
            addReflexEffects(reflexingCards, state);
            console.log("did reflex");
            throw errors_1.ControlEnum.PLAY_CARD;
        }
    }
};
const getReflexingPlayers = (state) => {
    let playersToReflex = state.readiedEffects.map(() => null);
    queue_1.forEachCardInQueue(state, card => {
        //Cards are reflexed one at a time, so even if 2 cards tell you to reflex, you only do it once.
        //But you will then restart the check loop, which will cause the next card to reflex.
        if (card.shouldReflex && !playersToReflex[card.player]) {
            console.log("card name: ", card.name, " | ", card.player);
            playersToReflex[card.player] = card.name;
            card.shouldReflex = undefined;
        }
    });
    return playersToReflex;
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
const addReflexEffects = (players, state) => {
    let lastEvent = state.events[state.events.length - 1];
    players.forEach((cardName, playedBy) => {
        //cannot read property events of undefined (lastEvent is null at some point for some reason)
        if (cardName &&
            Array.isArray(lastEvent.gameEvents) &&
            lastEvent.gameEvents[playedBy] &&
            Array.isArray(lastEvent.gameEvents[playedBy].gameEvents)) {
            lastEvent.gameEvents[playedBy].gameEvents.push({
                eventType: gameEvent_1.EventTypeEnum.MECHANIC,
                mechanicName: card_1.MechanicEnum.REFLEX,
                cardName,
                playedBy
            });
        }
    });
};
