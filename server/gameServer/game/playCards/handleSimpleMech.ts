import { Effect, Card, AxisEnum } from "../../../shared/card";
import { GameState, ReadiedEffect } from "../../interfaces/stateInterface";
import { splitArray } from "../../util";
import { handleBuff } from "../mechanics/buff";
import { addCrippleCardToOpponentsDeck } from "../mechanics/cripple";
import { markShouldReflexOnQueueCard } from "../mechanics/reflex";
import { handleFluid, handleRigid } from "../mechanics/rigidFluid";


const isSimpleMech = (reaEff: ReadiedEffect)=> effectRouter.hasOwnProperty(reaEff.effect.axis)
    
export const applySimpleMech = (state: GameState)=>{
    state.readiedEffects = state.readiedEffects.map(effs =>{
        const [simple, unused] = splitArray(effs, eff => isSimpleMech(eff))
        simple.forEach(simple => effectRouter[simple.effect.axis](simple.effect, simple.card, simple.card.player, simple.card.opponent, state))
        return unused
    })
}

const effectRouter: { [name: string]: (effect: Effect, card: Card, player: number, opponent: number, state: GameState) => void } = {
    [AxisEnum.BUFF]: handleBuff,
    [AxisEnum.CRIPPLE]: addCrippleCardToOpponentsDeck,
    [AxisEnum.REFLEX]: markShouldReflexOnQueueCard,
    [AxisEnum.FLUID]: handleFluid,
    [AxisEnum.RIGID]: handleRigid
}