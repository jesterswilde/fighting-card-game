import { GameState } from "../interfaces/stateInterface";
import { Card } from "../interfaces/cardInterface";
import { QUEUE_LENGTH } from "../gameSettings";

export const getLastPlayedCard = (state: GameState, player?: number): Card | null => {
    const { queue, currentPlayer } = state;
    if (player === undefined) {
        player = currentPlayer;
    }
    const index = queue[0].length - 1;
    if (index < 0) {
        return null;
    }
    return queue[0][index];
}