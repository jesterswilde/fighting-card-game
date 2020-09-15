import { handleReadiedMechanics, handleReadiedEffects } from "./effectHappens";
import { GameState, ReadiedEffect } from "../../interfaces/stateInterface";
import { ControlEnum } from "../../errors";
import { checkTelegraph } from "../mechanics/telegraph";
import { checkReflex } from "../mechanics/reflex";
import { checkFocus } from "../mechanics/focus";
import { applyStateEffects } from "./handleStateEffects";
import { collectBlockAndDamage, applyCollectedDamage } from "./collectDamage";
import { splitArray } from "../../util";
import { AxisEnum } from "../../../shared/card";
import { applyClutch } from "../mechanics/clutch";
import { checkPredictions } from "../mechanics/predict";

export const cardHappens = (state: GameState) => {
    try {
        collectBlockAndDamage(state);
        applyClutch(state);
        applyPoise(state);
        applyStateEffects(state);
        applyMechanics(state);
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

export const applyMechanics = (state: GameState) => {
    state.readiedMechanics.forEach((reaMech) => {
        handleReadiedMechanics(reaMech, state);
    })
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

export const applyPoise = (state: GameState) => {
    state.readiedEffects = state.readiedEffects.map((playerReaEffs, player) => {
        const [poiseArr, unusedArr] = splitArray(playerReaEffs, ({ effect }) => effect.axis === AxisEnum.POISE || effect.axis === AxisEnum.LOSE_POISE);
        poiseArr.forEach((reaEff) => {
            handleReadiedEffects(reaEff, state);
        })
        return unusedArr;
    });
}
