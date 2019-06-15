import { GameState, ReadiedEffect, HappensEnum } from "../../interfaces/stateInterface";
import { splitArray } from "../../util";
import { AxisEnum, MechanicEnum } from "../../../shared/card";
import { reduceStateChangeReaEff } from "./effectHappens";
import { collectParry } from "../mechanics/parry";
import { collectBlock } from "../mechanics/block";

export const collectBlockAndDamage = (state: GameState) => {
    collectParry(state);
    collectBlock(state);
    collectDamage(state); 
}


export const collectDamage = (state: GameState) => {
    state.readiedEffects = state.readiedEffects.map((playerEff, player) => {
        const [damageEffectsPlayer, otherEffects] = splitArray(playerEff, (reaEff) => reaEff.mechanic.axis === AxisEnum.DAMAGE);
        state.damageEffects[player] = state.damageEffects[player] || [];
        state.damageEffects[player].push(...damageEffectsPlayer);
        markDamaged(damageEffectsPlayer, state);
        return otherEffects;
    })
}

const markDamaged = (damageEffects: ReadiedEffect[], state: GameState)=>{
    damageEffects.forEach((damageEffect)=>{
        damageEffect.happensTo.forEach((happens, player)=>{
            if(happens === HappensEnum.HAPPENS){
                state.damaged[player] = true; 
            }
        })
    })
}

export const applyCollectedDamage = (state: GameState)=>{
    state.damageEffects.forEach((playerReaEffs)=>{
        playerReaEffs.forEach((reaEff)=> console.log('damage', reaEff)); 
        playerReaEffs.forEach((reaEff)=> reduceStateChangeReaEff(reaEff, state)); 
    })
    state.damageEffects = []; 
}