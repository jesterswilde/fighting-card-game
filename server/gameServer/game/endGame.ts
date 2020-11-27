import { GameState } from "../interfaces/stateInterface";
import { gameOverEvent, sendEvents } from "./events";

export const endGame = (state: GameState) => {
    gameOverEvent(state); 
    sendEvents(state); 
    sendGameOver(state); 
}

const sendGameOver = async(state: GameState)=>{
    state.agents.forEach((agent, i) => agent.gameOver(i === state.winner, state)); 
}

