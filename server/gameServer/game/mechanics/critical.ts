import { Card, Effect, Mechanic, MechanicEnum } from "../../../shared/card";
import { GameState, HandCard } from "../../interfaces/stateInterface";
import { meetsRequirements } from "../playCards/requirements";
import { getOpponent } from "../../util";

//Extra effects if certain (non-filtering) conditions are met

export const canUseCritical = (critical: Mechanic, player: number, opponent: number, state: GameState): boolean => {
    console.log("checking crit", critical)
    return critical.requirements.every((req) => {
        return meetsRequirements(req, state, player, opponent)
    });
}

export const markCritical = (state: GameState) => {
    state.hands.forEach((hand)=>{
        hand.forEach(({player, mechanics}) => {
            const opponent = getOpponent(player); 
            mechanics.filter(mech => mech.mechanic === MechanicEnum.CRITICAL)
            .forEach((crit) => {
                crit.canPlay = canUseCritical(crit, player, opponent, state);
            })
        })
    })
}

export const addCriticalToHandCard = (card: Card, handCard: HandCard)=>{
    card.mechanics.filter(mech => mech.mechanic == MechanicEnum.CRITICAL)
        .forEach(crit =>{
            if(crit.canPlay){
                handCard.activeCriticals = handCard.activeCriticals || [] 
                handCard.activeCriticals.push(crit.index)
            }
        })
}

export const getEffectsFromCrits = (crits: Mechanic[])=>{
    const effects: Effect[] = []; 
    crits.filter(crit => crit.canPlay)
        .forEach(crit => effects.push(...crit.effects))
    return effects
}