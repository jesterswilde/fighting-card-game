import { reduceMechanics } from "./effectReducer";
import { GameState, ReadiedEffect } from "../interfaces/stateInterface";
import { ControlEnum } from "../errors";
import { didPredictionHappen } from "./predictions";
import { shuffleDeck, addEnhancement } from "./startTurn";
import { deepCopy } from "../util";
import { mechReqsMet, canPlayCard } from "./requirements";
import { MechanicEnum } from "../../shared/card";
import { mechanicsToReadiedEffects } from "./playCard";
import { addRevealPredictionEvent } from "./events";

/*
    --- TODO ---
    if a telegraph adds a focus or some other effect that lives on the queue, that new effect should be
    it's own entity on the queue. This is not handled in any way currently. 
    smimilarly, if the card is undefined, we don't handle this at all. Will crash. 
*/
export const applyEffects = (state: GameState) => {
    try {
        console.log("Starting to apply effects"); 
        makeEffectsReduceable(state);
        console.log("removing stored effects"); 
        removeStoredEffects(state);
        checkForVictor(state);
        console.log("Checking predictions"); 
        checkPredictions(state);
        console.log("checking telegraph"); 
        checkTelegraph(state);
        console.log("checking reflex"); 
        checkReflex(state);
        console.log("checking focus"); 
        checkFocus(state);
    } catch (err) {
        if (err === ControlEnum.NEW_EFFECTS) {
            console.log("New effects were found"); 
            applyEffects(state);
        } else {
            throw (err)
        }
    }
}

export const makeEffectsReduceable = (state: GameState) => {
    reduceMechanics(state.readiedEffects, state);
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
            const didHappen = didPredictionHappen(pred, state)
            addRevealPredictionEvent(didHappen, pred.prediction, pred.card, state); 
            if (didHappen) {
                stateChanged = true;
                state.readiedEffects = state.readiedEffects || [];
                const readiedeffects = mechanicsToReadiedEffects(pred.mechanics, pred.card); 
                state.readiedEffects.push(...readiedeffects);
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
    let readied: ReadiedEffect[] = [];
    queue.forEach((cards = [], i) => {
        cards.forEach((card) => {
            //If the card was reflexed to on an opponents turn, it should wait until the opponent picks a new card. 
            //this might be better as a boolean that gets set on end turn. 
            const notReflexedLastTurn = (i !== 1 || card.player !== state.currentPlayer);
            if (i !== 0 && notReflexedLastTurn && card) {
                let telegraphs = card.telegraphs || [];
                const metTelegraphs = telegraphs.map((mech) => mechReqsMet(mech, card.opponent, card.player, state));
                if (metTelegraphs.length > 0) {
                    telegraphs.filter((_, i) => metTelegraphs[i])
                        .forEach((mech) => {
                            const mechEffs = mechanicsToReadiedEffects(mech.mechanicEffects, card); 
                            readied.push({mechanic: mech, card, isEventOnly: true, isHappening: true})
                            readied.push(...mechEffs)
                        });
                    card.telegraphs = telegraphs.filter((_, i) => !metTelegraphs[i]);
                }
                if (card.telegraphs && card.telegraphs.length === 0) {
                    card.telegraphs = undefined;
                }
            }
        }, state);
    })
    if (readied.length > 0) {
        state.readiedEffects = readied;
        throw ControlEnum.NEW_EFFECTS;
    }
}

export const checkReflex = (state: GameState) => {
    const { queue, readiedEffects = [] } = state;
    let playerToReflex: null | number = null;
    queue.forEach((cards = []) => {
        cards.forEach((card) => {
            if (card.shouldReflex && playerToReflex === null) {
                readiedEffects.push({card, mechanic:{mechanic: MechanicEnum.REFLEX}, isEventOnly: true, isHappening: true})
                console.log("card name: ", card.name, " | " , card.player); 
                playerToReflex = card.player;
                card.shouldReflex = undefined;
            }
        }, state);
    })
    state.readiedEffects = [...readiedEffects]; 
    if (playerToReflex !== null) {
        console.log("player to reflex", playerToReflex, "Current player", state.currentPlayer); 
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
        addEnhancement(card, state); 
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
                    .reduce((arr: ReadiedEffect[], mech) => {
                        arr.push({card, mechanic: mech, isEventOnly: true, isHappening: true})
                        const readiedEff = mechanicsToReadiedEffects(mech.mechanicEffects, card); 
                        arr.push(...readiedEff); 
                        return arr;
                    }, []);
                if (focused.length > 0) {
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