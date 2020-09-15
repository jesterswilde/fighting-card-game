"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let queue = [];
exports.addToLobbyQueue = (player) => {
    queue.push(player);
    evaluateQueue();
};
exports.removeFromQueue = (player) => {
    queue = queue.filter(queuePlayer => queuePlayer != player);
    evaluateQueue();
};
const evaluateQueue;
() => {
    if (queue.length < 2)
        return;
};
