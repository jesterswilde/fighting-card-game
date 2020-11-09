import { GameState } from "../interfaces/stateInterface";
import { convertBlockToParry } from "./mechanics/block";
import { addPoise } from "./mechanics/poise";
import { moveSetup } from "./mechanics/setup";
import { movePendingPredictions } from "./mechanics/predict";

export const startTurn = async (state: GameState) => {
    console.log('starting turn'); 
    addPoise(state);
    movePendingPredictions(state);
    moveSetup(state); 
    moveHandSizeMod(state); 
    convertBlockToParry(state); //This happens after so that the player will see the upcoming block
}

const moveHandSizeMod = (state: GameState)=>{
    state.handSizeMod = state.nextHandSizeMod; 
    state.nextHandSizeMod = [0,0]; 
}


