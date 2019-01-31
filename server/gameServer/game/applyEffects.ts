import { reduceMechanics } from "./effectReducer";
import { getLastPlayedCard } from "./queue";
import { GameState } from "../interfaces/stateInterface";
import { ControlEnum } from "../errors";
import { didPredictionHappen } from "./predictions";
import { shuffleDeck } from "./startTurn";
import { deepCopy } from "../util";
import { mechReqsMet, canPlayCard } from "./requirements";
import { Mechanic } from "../interfaces/cardInterface";

/*
    --- TODO ---
    if a telegraph adds a focus or some other effect that lives on the queue, that new effect should be
    it's own entity on the queue. This is not handled in any way currently. 
    smimilarly, if the card is undefined, we don't handle this at all. Will crash. 
*/
export const applyEffects = (state: GameState) => {
    try {
        makeEffectsReduceable(state);
        removeStoredEffects(state);
        checkForVictor(state);
        checkPredictions(state);
        checkTelegraph(state);
        checkReflex(state);
        checkFocus(state);
    } catch (err) {
        if (err === ControlEnum.NEW_EFFECTS) {
            applyEffects(state);
        } else {
            throw (err)
        }
    }
}

export const makeEffectsReduceable = (state: GameState) => {
    const card = getLastPlayedCard(state);
    reduceMechanics(state.readiedEffects, card, state.currentPlayer, card.opponent, state);
}

export const removeStoredEffects = (state: GameState) => {
    state.readiedEffects = undefined;
}

export const checkForVictor = (state: GameState) => {
    const { health } = state;
    if (health.every((hp) => hp <= 0)) {
        state.winner = -1;
    } else if (health[0] <= 0) {
        state.winner = 1;
    } else if (health[1] <= 0) {
        state.winner = 0;
    }
    if (state.winner !== undefined) {
        throw ControlEnum.GAME_OVER;
    }
}

export const checkPredictions = (state: GameState) => {
    const { pendingPredictions: predictions } = state;
    let stateChanged = false;
    if (predictions) {
        predictions.forEach((pred) => {
            if (didPredictionHappen(pred, state)) {
                stateChanged = true;
                state.readiedEffects = state.readiedEffects || [];
                state.readiedEffects.push(...deepCopy(pred.mechanics));
            }
        })
        state.pendingPredictions = undefined;
    }
    if (stateChanged) {
        throw ControlEnum.NEW_EFFECTS;
    }
}

export const checkTelegraph = (state: GameState) => {
    const { queue } = state;
    const recentCard = getLastPlayedCard(state);
    let readied = [];
    queue.forEach((cards = []) => {
        cards.forEach((card) => {
            if (card !== recentCard && card) {
                let telegraphs = card.telegraphs || [];
                const metTelegraphs = telegraphs.map((mech) => mechReqsMet(mech, card.opponent, card.player, state));
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
    })
    if (readied.length > 0) {
        state.readiedEffects = deepCopy(readied);
        throw ControlEnum.NEW_EFFECTS;
    }
}

export const checkReflex = (state: GameState) => {
    const { queue } = state;
    let playerToReflex: null | number = null;
    queue.forEach((cards) => {
        cards.forEach((card) => {
            if (card.shouldReflex && playerToReflex === null) {
                playerToReflex = card.player;
                card.shouldReflex = undefined;
            }
        }, state);
    })
    if (playerToReflex !== null) {
        reflexCard(playerToReflex, state);
    }
}

const reflexCard = (player: number, state: GameState) => {
    console.log('reflexing');
    const deck = state.decks[player];
    shuffleDeck(state, player);
    const cardIndex = deck.findIndex((card) => canPlayCard(card, state));
    if (cardIndex >= 0) {
        console.log('found card');
        const card = deck[cardIndex];
        state.decks[player] = deck.filter((card, i) => cardIndex !== i);
        card.opponent = card.player === 0 ? 1 : 0;
        state.pickedCard = card;
        console.log(card.name);
        throw ControlEnum.PLAY_CARD;
    } else {
        console.log('reflexed into nothing')
    }
}

export const checkFocus = (state: GameState) => {
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
                    .filter((mech) => mechReqsMet(mech, card.opponent, card.player, state))
                    .reduce((arr: Mechanic[], mech) => {
                        arr.push(...mech.mechanicEffects)
                        return arr;
                    }, []);
                if (focused.length > 0) {
                    modifiedState = true;
                    state.readiedEffects = state.readiedEffects || [];
                    state.readiedEffects.push(...deepCopy(focused));
                    modifiedState = true;
                }
            }
        })
    })
    if (modifiedState) {
        throw ControlEnum.NEW_EFFECTS;
    }
}