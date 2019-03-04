import { GameState } from "../interfaces/stateInterface";
import { sendState } from "./socket";
import { ANTICIPATING_POISE } from "../gameSettings";
import { givePlayersCards } from "./drawCards";

export const startTurn = async (state: GameState) => {
    console.log('starting turn'); 
    addPoise(state);
    givePlayersCards(state);
    sendState(state);
}

export const addPoise = (state: GameState) => {
    const { playerStates } = state;
    playerStates.forEach((pState) => {
        if (state.turnNumber !== 0 && pState.poise < ANTICIPATING_POISE - 1) {
            pState.poise++;
        }
    })
}