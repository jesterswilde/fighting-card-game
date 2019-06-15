import { Mechanic, Card } from "../../../shared/card";
import { GameState } from "../../interfaces/stateInterface";

/*
    Setup increases the priority of all cards played next turn. 

    Maybe this should be modified to be of the next card played? 
    Setup is updated at the start of each turn
*/

export const reduceSetup = (mechanic: Mechanic, card: Card, player: number, opponent: number, state: GameState)=>{
    state.pendingSetup[player] = state.pendingSetup[player] || 0; 
    state.pendingSetup[player] += Number(mechanic.amount); 
}