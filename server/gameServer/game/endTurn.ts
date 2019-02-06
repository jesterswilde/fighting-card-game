import { GameState, BalanceEnum, MotionEnum, StandingEnum } from "../interfaces/stateInterface";
import { QUEUE_LENGTH } from "../gameSettings";
import { makeModifiedAxis } from "../util";

export const endTurn = async (state: GameState) => {
    cullQueue(state);
    decrementCounters(state);
    clearTurnData(state);
    changePlayers(state);
}

export const cullQueue = (state: GameState) => {
    const { decks, queue } = state;
    if (queue.length > QUEUE_LENGTH) {
        const cards = queue.pop();
        cards.forEach((card) => {
            console.log('culling', card.name, card.player)
            if (card.name !== 'Panic') {
                decks[card.player].push(card);
            }
        })
    }
}

const decrementCounters = (state: GameState) => {
    const { stateDurations, playerStates } = state;

    stateDurations.forEach((duration, i) => {
        if (duration.balance !== null && duration.balance !== undefined) {
            duration.balance--;
            if (duration.balance <= 0) {
                duration.balance = null;
                playerStates[i].balance = BalanceEnum.BALANCED;
            }
        }
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
    const opponent = state.currentPlayer === 0 ? 1 : 0; 
    state.damaged = [false, false];
    state.turnIsOver = false;
    state.modifiedAxis = makeModifiedAxis();
    state.turnIsOver = false;
    state.incrementedQueue = false;
    state.pendingPredictions = state.predictions;
    state.predictions = null; 
    state.block[opponent] = 0; 
}

const changePlayers = (state: GameState) => {
    const player = state.currentPlayer === 0 ? 1 : 0;
    state.currentPlayer = player;
}