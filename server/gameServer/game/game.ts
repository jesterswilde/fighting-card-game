import { GameState} from "../interfaces/stateInterface";
import { ControlEnum } from "../errors";
import { SocketEnum } from "../../shared/socket";
import { sendState } from "./socket";
import { playCards } from "./playCards/playCard";
import { startTurn } from "./startTurn";
import { endTurn } from "./endTurn";
import { addGameOverEvent, sendEvents } from "./events";
import { getOpponent } from "../util";

export const playGame = async (state: GameState) => {
    try {
        startGame(state);
        while (true) {
            await playTurn(state)
        }
    } catch (err) {
        if (err === ControlEnum.GAME_OVER) {
            endGame(state);
        } else {
            console.error(err)
        }
    }
}

const startGame = (state: GameState) => {
    console.log("Game starting", state); 
    assignPlayerToDecks(state);
    sendState(state);
    state.sockets.forEach((socket, i) => {
        socket.emit(SocketEnum.START_GAME, { player: i });
    })
}

const endGame = (state: GameState) => {
    addGameOverEvent(state.winner, state); 
    sendState(state); 
    sendEvents(state); 
}

export const playTurn = async (state: GameState) => {
    sendState(state); 
    await startTurn(state);
    await playCards(state);
    endTurn(state);
}



const assignPlayerToDecks = (state: GameState) => {
    for (let player = 0; player < state.decks.length; player++) {
        const deck = state.decks[player];
        for (let i = 0; i < deck.length; i++) {
            deck[i].player = player;
            deck[i].opponent = getOpponent(player); 
            deck[i].id = state.cardUID++; 
        }
    }
}