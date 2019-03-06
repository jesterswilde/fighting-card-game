import { GameState, ReadiedEffect } from "../../interfaces/stateInterface";
import { splitArray } from "../../util";
import { AxisEnum, MechanicEnum } from "../../../shared/card";
import { reduceStateChangeReaEff } from "./effectHappens";

export const collectBlockAndDamage = (state: GameState) => {
    collectParry(state);
    collectBlock(state);
    collectDamage(state); 
}

export const convertBlockToParry = (state: GameState) => {
    state.block = state.block.map((block, index) => {
        state.parry[index] += block;
        return 0;
    })
}

const collectParry = (state: GameState) => {
    const parryArrs: ReadiedEffect[][] = [];
    state.readiedEffects = state.readiedEffects.map((playerEff, index) => {
        const [hasParry, unused] = splitArray(playerEff, (reaEff) => reaEff.mechanic.mechanic === MechanicEnum.PARRY);
        parryArrs[index] = hasParry;
        return unused;
    })
    const parry = parryArrs.map((arr) => {
        return arr.reduce((total, { mechanic: { amount = 0 } }) => total + Number(amount), 0);
    });
    parry.forEach((amount, index)=> state.parry[index] += amount); 
}

const collectBlock = (state: GameState) => {
    const blockArrs: ReadiedEffect[][] = []; 
    state.readiedEffects = state.readiedEffects.map((playerEff, index)=>{
        const [hasBlock, unused] = splitArray(playerEff, (reaEff) => reaEff.mechanic.mechanic === MechanicEnum.BLOCK);
        blockArrs[index] = hasBlock;
        return unused;
    })
    const block = blockArrs.map((arr) => {
        return arr.reduce((total, { mechanic: { amount = 0 } }) => total + Number(amount), 0);
    });
    block.forEach((amount, index)=> state.block[index] += amount); 
}

export const collectDamage = (state: GameState) => {
    state.readiedEffects = state.readiedEffects.map((playerEff, player) => {
        const [damageEffectsPlayer, otherEffects] = splitArray(playerEff, (reaEff) => reaEff.mechanic.axis === AxisEnum.DAMAGE);
        state.damageEffects[player] = damageEffectsPlayer;
        return otherEffects;
    })
}

export const applyCollectedDamage = (state: GameState)=>{
    state.damageEffects.forEach((playerReaEffs)=>{
        playerReaEffs.forEach((reaEff)=> console.log('damage', reaEff)); 
        playerReaEffs.forEach((reaEff)=> reduceStateChangeReaEff(reaEff, state)); 
    })
    state.damageEffects = []; 
}