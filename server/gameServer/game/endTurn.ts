import { GameState, PoiseEnum, MotionEnum, StandingEnum } from "../interfaces/stateInterface";
import { QUEUE_LENGTH } from "../gameSettings";
import { makeModifiedAxis } from "../util";
import { sendEvents } from "./events";
import { sendState } from "./socket";
import { forEachCardInQueue } from "./queue";

export const endTurn = async (state: GameState) => {
    cullQueue(state);
    decrementCounters(state);
    clearTurnData(state);
    sendState(state);
    sendEvents(state); 
    console.log('turn ended'); 
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
            decks[card.player].push(card); 
        }
    })
    if(state.queue.length >= QUEUE_LENGTH){
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
    state.modifiedAxis = makeModifiedAxis();
    state.incrementedQueue = false;
    state.pendingPredictions = state.predictions;
    state.predictions = null; 
    state.parry = state.parry.map(()=> 0)
    state.checkedFocus = false; 
}
