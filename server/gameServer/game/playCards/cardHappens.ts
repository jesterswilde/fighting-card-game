import { reduceMechanics } from "./effectHappens";
import { GameState } from "../../interfaces/stateInterface";
import { ControlEnum } from "../../errors";
import { didPredictionHappen } from "./predictions";
import { addRevealPredictionEvent, storeEffectsForEvents, processEffectEvents } from "../events";
import { checkTelegraph } from "../checkMechanics/telegraph";
import { checkReflex } from "../checkMechanics/reflex";
import { checkFocus } from "../checkMechanics/focus";
import { mechanicsToReadiedEffects, addReadiedToState } from "../readiedEffects";
import { applyStateEffects } from "./handleStateEffects";
import { collectBlockAndDamage, applyCollectedDamage } from "./collectDamage";

/*
    --- TODO ---
    if a telegraph adds a focus or some other effect that lives on the queue, that new effect should be
    it's own entity on the queue. This is not handled in any way currently. 
    smimilarly, if the card is undefined, we don't handle this at all. Will crash. 
*/


/*
    ++ NEW ORDER ++
    apply parry
    apply state effects
    check predictions
    add delayed effects (telegraphs, focus)
    apply damage -- Breaking this out will help possibly modify order later
    check for reflex
    check telegraph
    check focus
*/ 
export const cardHappens = (state: GameState) => {
    try {
        //parry
        //collect damage
        storeEffectsForEvents(state); 
        collectBlockAndDamage(state); 
        applyStateEffects(state);
        applyMechanics(state);
        processEffectEvents(state); 
        removeStoredEffects(state);
        checkPredictions(state);
        applyCollectedDamage(state); 
        checkForVictor(state);
        checkReflex(state);
        checkTelegraph(state);
        checkFocus(state);
    } catch (err) {
        if (err === ControlEnum.NEW_EFFECTS) {
            console.log("New effects were found");
            cardHappens(state);
        } else {
            throw (err)
        }
    }
}



export const applyMechanics = (state: GameState) => {
    state.readiedEffects.forEach((playerEffects) => {
        reduceMechanics(playerEffects, state);
    })
}

export const removeStoredEffects = (state: GameState) => {
    state.readiedEffects = state.readiedEffects.map(() => []);
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
                const readied = mechanicsToReadiedEffects(pred.mechanics, pred.card, state);
                addReadiedToState(readied, state); 
            }
        })
        state.pendingPredictions = undefined;
    }
    if (stateChanged) {
        throw ControlEnum.NEW_EFFECTS;
    }
}

