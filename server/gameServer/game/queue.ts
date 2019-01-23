import { GameState } from "../interfaces/stateInterface";
import { Card } from "../interfaces/cardInterface";
import { QUEUE_LENGTH } from "../gameSettings";

export const getLastPlayedCard = (state: GameState, player?: number): Card | null => {
    const { queues, currentPlayer } = state;
    if (player === undefined) {
        player = currentPlayer;
    }
    const queue = queues[player];

    const index = queue[player].length - 1;
    if (index < 0) {
        return null;
    }
    return queue[player][index];
}

export const iterateQueue = (cb: (card: Card, currentPlayer: number, state: GameState) => void, state: GameState) => {
    const { queues, currentPlayer } = state;
    const opponent = currentPlayer === 0 ? 1 : 0; 
    for (let i = QUEUE_LENGTH + 1; i >= 0; i--) {
        [currentPlayer, opponent].forEach((player)=>{
            const playerQueue = queues[player] || []; 
            const queue = playerQueue[i] || []; 
            queue.forEach((card)=> cb(card, player, state));
        })
    }
}
