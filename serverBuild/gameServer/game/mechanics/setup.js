"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
    Setup increases the priority of all cards played next turn.

    Maybe this should be modified to be of the next card played?
    Setup is updated at the start of each turn
*/
exports.reduceSetup = (mechanic, card, player, opponent, state) => {
    state.pendingSetup[player] = state.pendingSetup[player] || 0;
    state.pendingSetup[player] += Number(mechanic.amount);
};