"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forEachCardInQueue = void 0;
exports.forEachCardInQueue = (state, cb) => {
    state.queue.forEach((queueSlot, queueIndex) => {
        queueSlot.forEach((playerCards, player) => {
            playerCards.forEach((card) => {
                cb(card, queueIndex);
            });
        });
    });
};
