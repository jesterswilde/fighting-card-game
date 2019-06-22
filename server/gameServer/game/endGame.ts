import { GameState } from "../interfaces/stateInterface";
import { addGameOverEvent, sendEvents } from "./events";
import { sendState } from "./socket";
import { SocketEnum, GameOverEnum } from "../../shared/socket";

export const endGame = (state: GameState) => {
    addGameOverEvent(state.winner, state); 
    sendState(state); 
    sendEvents(state); 
}

const sendGameOver = async(state: GameState)=>{
    state.sockets.forEach((socket)=>{
        socket.emit(SocketEnum.GAME_OVER);
        socket.once(SocketEnum.END_GAME_CHOICE, (choice: GameOverEnum)=>{
            switch(choice){
                case GameOverEnum.FIND_NEW_OPP_WITH_NEW_DECK:
                    
                    break;
                case GameOverEnum.FIND_NEW_OPP_WITH_SAME_DECK:
                    break;
            }
        })
    })
}

