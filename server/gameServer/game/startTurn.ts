import { GameState } from "../interfaces/stateInterface";
import { sendState } from "./socket";
import { ANTICIPATING_POISE } from "../gameSettings";
import { givePlayersCards } from "./drawCards";
import { convertBlockToParry } from "./playCards/collectDamage";

export const startTurn = async (state: GameState) => {
    console.log('starting turn'); 
    addPoise(state);
    movePendingPredictions(state);
    moveSetup(state); 
    givePlayersCards(state);
    sendState(state);
    convertBlockToParry(state); 
}

const movePendingPredictions = (state: GameState)=>{
    state.predictions = state.pendingPredictions; 
    state.pendingPredictions = []; 
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