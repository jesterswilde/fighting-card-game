import { GameState } from "../../interfaces/stateInterface"
import { Effect, Card, AxisEnum, PlayerEnum } from "../../../shared/card"


export const handleRigid = (effect: Effect, card: Card, player: number, opponent: number, state: GameState)=>{
    if(effect.player === PlayerEnum.PLAYER || effect.player === PlayerEnum.BOTH){
        state.nextHandSizeMod[player] = state.nextHandSizeMod[player] || 0; 
        state.nextHandSizeMod[player]  -= effect.amount; 
    }
    if(effect.player === PlayerEnum.OPPONENT || effect.player === PlayerEnum.BOTH){
        state.nextHandSizeMod[opponent] = state.nextHandSizeMod[opponent] || 0; 
        state.nextHandSizeMod[opponent]  -= effect.amount; 
    }
}

export const handleFluid = (effect: Effect, card: Card, player: number, opponent: number, state: GameState)=>{
    if(effect.player === PlayerEnum.PLAYER || effect.player === PlayerEnum.BOTH){
        state.nextHandSizeMod[player] = state.nextHandSizeMod[player] || 0; 
        state.nextHandSizeMod[player]  += effect.amount; 
    }
    if(effect.player === PlayerEnum.OPPONENT || effect.player === PlayerEnum.BOTH){
        state.nextHandSizeMod[opponent] = state.nextHandSizeMod[opponent] || 0; 
        state.nextHandSizeMod[opponent]  += effect.amount; 
    }
}