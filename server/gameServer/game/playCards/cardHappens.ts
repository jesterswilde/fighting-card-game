import { reduceMechanics, reduceStateChangeReaEff } from "./effectHappens";
import { GameState, ReadiedEffect } from "../../interfaces/stateInterface";
import { ControlEnum } from "../../errors";
import { storeEffectsForEvents, processEffectEvents, processPlayedCardEvents } from "../events";
import { checkTelegraph } from "../checkMechanics/telegraph";
import { checkReflex } from "../checkMechanics/reflex";
import { checkFocus } from "../checkMechanics/focus";
import { applyStateEffects } from "./handleStateEffects";
import { collectBlockAndDamage, applyCollectedDamage } from "./collectDamage";
import { checkPredictions } from "./predictions";
import { splitArray } from "../../util";
import { AxisEnum } from "../../../shared/card";
import { applyClutch } from "../checkMechanics/priority";

export const cardHappens = (state: GameState) => {
    try {
        storeEffectsForEvents(state);
        collectBlockAndDamage(state);
        applyClutch(state);
        applyPoise(state);
        applyStateEffects(state);
        applyMechanics(state);
        processPlayedCardEvents(state); 
        processEffectEvents(state);
        removeStoredEffects(state);
        checkPredictions(state);
        checkReflex(state);
        checkTelegraph(state);
        checkFocus(state);
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

export const applyPoise = (state: GameState) => {
    state.readiedEffects = state.readiedEffects.map((playerReaEffs, player) => {
        const [poiseArr, unusedArr] = splitArray(playerReaEffs, ({ mechanic }) => mechanic.axis === AxisEnum.POISE || mechanic.axis === AxisEnum.LOSE_POISE);
        poiseArr.forEach((reaEff) => {
            reduceStateChangeReaEff(reaEff, state);
        })
        return unusedArr;
    });
}
