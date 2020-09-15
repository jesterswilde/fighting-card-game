import { GameState} from "../interfaces/stateInterface";
import { ControlEnum } from "../errors";
import { SocketEnum } from "../../shared/socket";
import { sendState } from "./send";
import { playCards } from "./playCards/playCard";
import { startTurn } from "./startTurn";
import { endTurn } from "./endTurn";
import { getOpponent } from "../util";
import { endGame } from "./endGame";


/*
    Game Start - get decks
    Game Loop
        Turn
            Shuffle
            Make Predicitons //Await
            Draw Cards //Send
                Add Enhancements
                Add Buffs
                Modify hand size based on Fluid / Rigid
            Pick Card //Await  --Reflex Jumps to here
            Make Choices //Await
            Return Unpicked Cards
            Collect Effects and Mechanics
            Card Happens
                Gather Effects
                        Omit Criticals with unmet reqs 
                        Store Mechanics On Card (Predict, Telegraph, Focus)
                        Mark Axis for predictions
                Move Cards Up in Queue
                Picked Card is put onto Queue //Send X
                Apply Effects  --Telegaph and Focus jump to here
                    Apply effects
                    Remove Stored Effects
                    Victory?
                        End Game //Send
                    Check Predictions
                        Apply Effects
                    Telegraph? 
                        Apply Effects
                    Focus?
                        Apply Effects
                    Reflex?
                        Shuffle
                        Card Happens
            Remove Old Cards From Queue?
            Turn End
                Decrement Counters
*/

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
    state.agents.forEach((agent, i) => {
        agent.startGame(i)
    })
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
            if(typeof deck[i] !== 'object'){
                console.log("Missing card", deck[i]);
            }else{
                deck[i].player = player;
                deck[i].opponent = getOpponent(player); 
                deck[i].id = state.cardUID++; 
            }
        }
    }
}