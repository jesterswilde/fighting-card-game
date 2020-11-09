import { applyComplexMech, handleReadiedComplexMech } from "./handleComplexMech";
import { GameState, ReadiedEffect } from "../../interfaces/stateInterface";
import { ControlEnum } from "../../errors";
import { checkTelegraph } from "../mechanics/telegraph";
import { checkReflex } from "../mechanics/reflex";
import { checkFocus } from "../mechanics/focus";
import { applyStateEffects, handleReadiedEffects } from "./handleStateEffects";
import { collectBlockAndDamage, applyCollectedDamage } from "./handleDamage";
import { applyClutch } from "../mechanics/clutch";
import { checkPredictions } from "../mechanics/predict";
import { applySimpleMech } from "./handleSimpleMech";
import { applyPoise } from "../mechanics/poise";

export const cardHappens = (state: GameState) => {
    try {
        collectBlockAndDamage(state);
        applyClutch(state);
        applyPoise(state);
        applyComplexMech(state);
        applySimpleMech(state); 
        applyStateEffects(state);
        clearReadiedEffectsAndMechanics(state);
        checkPredictions(state);
        checkTelegraph(state);
        checkFocus(state);
        checkReflex(state);
        applyCollectedDamage(state);
        checkForVictor(state);
    } catch (err) {
        if (err === ControlEnum.NEW_EFFECTS) {
            console.log("New effects were found");
            cardHappens(state);
        } else {
            throw (err)
        }
    }
}

export const clearReadiedEffectsAndMechanics = (state: GameState) => {
    state.readiedEffects = state.readiedEffects.map(() => []);
    state.readiedMechanics = state.readiedMechanics.map(()=> []);
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
