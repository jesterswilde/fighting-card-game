import { PoiseEnum, GameState } from "../../interfaces/stateInterface";
import { UNBALANCED_POISE, ANTICIPATING_POISE } from "../../gameSettings";

export const hasPoise = (poiseEnum: PoiseEnum, player: number, state: GameState)=>{
    const {poise} = state.playerStates[player]
    switch(poiseEnum){
        case PoiseEnum.NOT_ANTICIPATING:
            return poise < ANTICIPATING_POISE; 
        case PoiseEnum.UNBALANCED:
            return poise <= UNBALANCED_POISE;
        case PoiseEnum.BALANCED:
            return poise > UNBALANCED_POISE; 
        case PoiseEnum.ANTICIPATING:
            return poise >= ANTICIPATING_POISE; 
        default:
            return false; 
    }
}