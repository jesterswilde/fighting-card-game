import { GameState } from "../interfaces/stateInterface";
import { gameOverEvent, sendEvents } from "./events";
import { sendState } from "./send";

export const endGame = (state: GameState) => {
    gameOverEvent(state); 
    sendState(state); 
    sendEvents(state); 
    sendGameOver(state); 
}

const sendGameOver = async(state: GameState)=>{
    state.agents.forEach(agent => agent.gameOver()); 
}

