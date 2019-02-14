import { PoiseEnum, GameState } from "../interfaces/stateInterface";

export const hasPoise = (poiseEnum: PoiseEnum, player: number, state: GameState)=>{
    const {poise} = state.playerStates[player]
    switch(poiseEnum){
        case PoiseEnum.UNBALANCED:
            return poise <= 3;
        case PoiseEnum.BALANCED:
            return poise > 3; 
        case PoiseEnum.ANTICIPATING:
            return poise >= 7; 
        default:
            return false; 
    }
}