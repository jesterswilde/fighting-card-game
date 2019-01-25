"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastPlayedCard = (state, player) => {
    const { queue, currentPlayer } = state;
    if (player === undefined) {
        player = currentPlayer;
    }
    const index = queue[0].length - 1;
    if (index < 0) {
        return null;
    }
    return queue[0][index];
};
