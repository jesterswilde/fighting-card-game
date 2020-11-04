import { GameState } from "../interfaces/stateInterface";
import { gameOverEvent, sendEvents } from "./events";
import { sendState } from "./send";

export const endGame = (state: GameState) => {
    gameOverEvent(state); 
    sendEvents(state); 
    sendState(state); 
    sendGameOver(state); 
}

const sendGameOver = async(state: GameState)=>{
    state.agents.forEach(agent => agent.gameOver()); 
}

