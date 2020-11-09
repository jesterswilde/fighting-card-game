import { PoiseEnum, GameState } from "../../interfaces/stateInterface";
import { UNBALANCED_POISE, ANTICIPATING_POISE } from "../../gameSettings";
import { AxisEnum } from "../../../shared/card";
import { splitArray } from "../../util";
import { handleReadiedEffects } from "../playCards/handleStateEffects";

export const applyPoise = (state: GameState) => {
    state.readiedEffects = state.readiedEffects.map((playerReaEffs, player) => {
        const [poiseArr, unusedArr] = splitArray(playerReaEffs, ({ effect }) => effect.axis === AxisEnum.POISE || effect.axis === AxisEnum.LOSE_POISE);
        poiseArr.forEach((reaEff) => {
            handleReadiedEffects(reaEff, state);
        })
        return unusedArr;
    });
}

export const hasPoise = (poiseEnum: PoiseEnum, player: number, state: GameState)=>{
    const {poise} = state.playerStates[player]
    switch(poiseEnum){
        case PoiseEnum.NOT_ANTICIPATING:
            return poise < ANTICIPATING_POISE; 
        case PoiseEnum.UNBALANCED:
            return poise <= UNBALANCED_POISE;
        case PoiseEnum.BALANCED:
            return poise > UNBALANCED_POISE; 
        case PoiseEnum.ANTICIPATING:
            return poise >= ANTICIPATING_POISE; 
        default:
            return false; 
    }
}

export const addPoise = (state: GameState) => {
    const { playerStates } = state;
    playerStates.forEach((pState) => {
        if (state.turnNumber !== 0 && pState.poise < ANTICIPATING_POISE - 1) {
            pState.poise++;
        }
    })
}
