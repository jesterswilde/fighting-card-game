import { GameState, PoiseEnum, MotionEnum, StandingEnum } from "../interfaces/stateInterface";
import { QUEUE_LENGTH } from "../gameSettings";
import { makeModifiedAxis } from "../util";
import { sendEvents } from "./events";
import { forEachCardInQueue } from "./queue";

export const endTurn = async (state: GameState) => {
    cullQueue(state);
    decrementCounters(state);
    clearTurnData(state);
    sendEvents(state);
    capPoise(state); 
    console.log('turn ended'); 
}

const capPoise = (state: GameState)=>{
    state.playerStates.forEach((pState)=>{
        pState.poise = Math.max(0, pState.poise);
        pState.poise = Math.min(10, pState.poise);  
    })
}

export const cullQueue = (state: GameState) => {
    const { decks, queue } = state;
    forEachCardInQueue(state, (card, queueIndex)=>{
        if(queueIndex >= QUEUE_LENGTH && card.name !== "Panic"){
            card.telegraphs = undefined; 
            card.focuses = undefined; 
            card.shouldReflex = false; 
            card.predictions = undefined; 
            card.enhancements = undefined; 
            card.clutch = 0; 
            decks[card.player].push(card); 
        }
    })
    if(state.queue.length > QUEUE_LENGTH){
        queue.pop(); 
    }
}

const decrementCounters = (state: GameState) => {
    const { stateDurations, playerStates } = state;

    stateDurations.forEach((duration, i) => {
        if (duration.motion !== null && duration.motion !== undefined) {
            duration.motion--;
            if (duration.motion <= 0) {
                duration.motion = null;
                playerStates[i].motion = MotionEnum.STILL;
            }
        }
        if (duration.standing !== null && duration.standing !== undefined) {
            duration.standing--;
            if (duration.standing <= 0) {
                duration.standing = null;
                playerStates[i].standing = StandingEnum.STANDING;
            }
        }
    })
}

const clearTurnData = (state: GameState) => {
    state.damaged = state.damaged.map(()=> false);
    state.turnIsOver = false;
    state.modifiedAxis = state.modifiedAxis.map(()=> makeModifiedAxis());
    state.incrementedQueue = false;
    state.parry = state.parry.map(()=> 0);
    state.checkedFocus = false;
    state.pickedCards = state.agents.map(_=> null)
    state.turnNumber++; 
}
