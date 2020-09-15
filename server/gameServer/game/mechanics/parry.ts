import { GameState, ReadiedEffect } from "../../interfaces/stateInterface";
import { splitArray } from "../../util";
import { AxisEnum } from "../../../shared/card";

/*
    reduces incoming damage by N amount
*/

export const collectParry = (state: GameState) => {
    const parryArrs: ReadiedEffect[][] = [];
    state.readiedEffects = state.readiedEffects.map((readiedEffect, playerIndex) => {
        const [parryEffects, unused] = splitArray(readiedEffect, (reaEff) => reaEff.effect.axis === AxisEnum.PARRY);
        parryArrs[playerIndex] = parryEffects;
        return unused;
    })
    const parry = parryArrs.map((arr) => {
        return arr.reduce((total, { effect: { amount = 0 } }) => total + Number(amount), 0);
    });
    parry.forEach((amount, index)=> state.parry[index] += amount); 
}
