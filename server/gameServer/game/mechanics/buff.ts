import { AxisEnum, Card, Effect, PlayerEnum } from "../../../shared/card";
import { GameState } from "../../interfaces/stateInterface";
import { splitArray } from "../../util";

/*
    Buff permanently increases the damage of a card by N amount on every successive play of that card. 
*/

export const applyBuff = (state: GameState)=>{
    console.log("applying buff"); 
    state.readiedEffects =  state.readiedEffects.map((allEffs) =>{
        const [buffEff, unusedEffs] = splitArray(allEffs, ({effect}) => effect.axis == AxisEnum.BUFF)
        buffEff.forEach(eff => handleBuff(eff.effect, eff.card))
        return unusedEffs; 
    })    
}

export const handleBuff = (effect: Effect, card: Card) => {
    console.log("Hanlde buff called: ", card, effect)
    card.buffed = card.buffed || 0; 
    card.buffed += effect.amount; 
}
/**
 * Returns effects for use in card display or effects
 */
export const makeEffectsFromBuff = (card: Card): Effect[]=>{
    if(!card.buffed)
        return []
    return [{
        player: PlayerEnum.OPPONENT,
        axis: AxisEnum.DAMAGE,
        amount: card.buffed
    }]
}