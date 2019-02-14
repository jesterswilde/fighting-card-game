"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const effectReducer_1 = require("./effectReducer");
const queue_1 = require("./queue");
const errors_1 = require("../errors");
const predictions_1 = require("./predictions");
const startTurn_1 = require("./startTurn");
const util_1 = require("../util");
const requirements_1 = require("./requirements");
const cardInterface_1 = require("../interfaces/cardInterface");
const playCard_1 = require("./playCard");
const events_1 = require("./events");
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
    effectReducer_1.reduceMechanics(state.readiedEffects, state);
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
            const didHappen = predictions_1.didPredictionHappen(pred, state);
            events_1.addRevealPredictionEvent(didHappen, pred.prediction, pred.card, state);
            if (didHappen) {
                stateChanged = true;
                state.readiedEffects = state.readiedEffects || [];
                const readiedeffects = playCard_1.mechanicsToReadiedEffects(pred.mechanics, pred.card);
                state.readiedEffects.push(...readiedeffects);
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
                        .forEach((mech) => {
                        const mechEffs = playCard_1.mechanicsToReadiedEffects(mech.mechanicEffects, card);
                        readied.push(...mechEffs);
                    });
                    card.telegraphs = telegraphs.filter((_, i) => !metTelegraphs[i]);
                }
                if (card.telegraphs && card.telegraphs.length === 0) {
                    card.telegraphs = undefined;
                }
            }
        }, state);
    });
    if (readied.length > 0) {
        readied.forEach((eff) => events_1.addMechanicEvent(cardInterface_1.MechanicEnum.TELEGRAPH, eff.card, state));
        state.readiedEffects = readied;
        throw errors_1.ControlEnum.NEW_EFFECTS;
    }
};
exports.checkReflex = (state) => {
    const { queue } = state;
    let playerToReflex = null;
    queue.forEach((cards) => {
        cards.forEach((card) => {
            if (card.shouldReflex && playerToReflex === null) {
                console.log("card name: ", card.name, " | ", card.player);
                playerToReflex = card.player;
                card.shouldReflex = undefined;
                events_1.addMechanicEvent(cardInterface_1.MechanicEnum.REFLEX, card, state);
            }
        }, state);
    });
    if (playerToReflex !== null) {
        console.log("player to reflex", playerToReflex, "Current player", state.currentPlayer);
        reflexCard(playerToReflex, state);
    }
};
const reflexCard = (player, state) => {
    console.log('reflexing');
    const deck = state.decks[player];
    startTurn_1.shuffleDeck(state, player);
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
                    const readiedEff = playCard_1.mechanicsToReadiedEffects(mech.mechanicEffects, card);
                    arr.push(...readiedEff);
                    return arr;
                }, []);
                if (focused.length > 0) {
                    focused.forEach((focus) => events_1.addMechanicEvent(cardInterface_1.MechanicEnum.FOCUS, focus.card, state));
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
