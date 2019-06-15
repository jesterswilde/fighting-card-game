import { GameState, ReadiedEffect } from "../../interfaces/stateInterface";
import { splitArray } from "../../util";
import { MechanicEnum } from "../../../shared/card";

/*
    reduces incoming damage by N amount
*/

export const collectParry = (state: GameState) => {
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
