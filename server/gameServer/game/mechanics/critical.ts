import { Mechanic, MechanicEnum } from "../../../shared/card";
import { GameState } from "../../interfaces/stateInterface";
import { meetsRequirements } from "../playCards/requirements";
import { getOpponent } from "../../util";

//Extra effects if certain (non-filtering) conditions are met

export const canUseCritical = (critical: Mechanic, player: number, opponent: number, state: GameState): boolean => {
    return critical.requirements.every((req) => {
        return meetsRequirements(req, state, player, opponent)
    });
}

export const markCritical = (state: GameState) => {
    state.hands.forEach((hand)=>{
        hand.forEach(({player, mechanics}) => {
            const opponent = getOpponent(player); 
            mechanics.filter(mech => mech.mechanic === MechanicEnum.CRITICAL)
            .forEach((opt) => {
                opt.canPlay = canUseCritical(opt, player, opponent, state);
            })
        })
    })
}