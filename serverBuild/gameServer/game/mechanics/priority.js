"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
    Priority is the process by which conflicting states is resolved.
    Priority is the base card's priority plus clutch (on card) plus setup (on state)
*/
exports.calculatePriority = (card, player, state) => {
    const clutch = card.clutch || 0;
    const priority = card.priority || 0;
    const setup = state.setup[player] || 0;
    return clutch + priority + setup;
};
