import { GameState, ReadiedEffect } from "../../interfaces/stateInterface";
import { MechanicEnum, Mechanic, Effect } from "../../../shared/card";
import { readyEffects } from "../readiedEffects";
import { splitArray } from "../../util";

/*
    A player is given a few choices by a card, and get to pick only one. 
*/

export const playerPicksOne = async (player: number, state: GameState) => {
    const { agents } = state;
    const card = state.pickedCards[player];
    const [pickedOne, unused] = splitArray(state.readiedMechanics[player], (reaMech => reaMech.mechanic.mechanic === MechanicEnum.PICK_ONE))
    const pickedEffects: Effect[] = []; 
    for (let i = 0; i < pickedOne.length; i++) {
        const { mechanic, card, } = pickedOne[i]
            const choice = await agents[player].getPickOneChoice(card.name, mechanic.index);
            const picked = mechanic.choices[choice];
            pickedEffects.push(...picked)
    }
    state.readiedMechanics[player] = unused; 
    state.readiedEffects[player] = [...state.readiedEffects[player], ...readyEffects(pickedEffects, card, state)];
}

