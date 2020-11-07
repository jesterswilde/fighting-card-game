import { GameState } from "../interfaces/stateInterface";
import { ANTICIPATING_POISE } from "../gameSettings";
import { convertBlockToParry } from "./mechanics/block";

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

const movePendingPredictions = (state: GameState)=>{
    state.predictions = state.pendingPredictions; 
    state.pendingPredictions = state.agents.map(_=>null); 
}


export const addPoise = (state: GameState) => {
    const { playerStates } = state;
    playerStates.forEach((pState) => {
        if (state.turnNumber !== 0 && pState.poise < ANTICIPATING_POISE - 1) {
            pState.poise++;
        }
    })
}

export const moveSetup = (state: GameState)=>{
    state.setup = state.pendingSetup; 
    state.pendingSetup = state.pendingSetup.map(()=> 0); 
}