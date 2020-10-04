"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const human_1 = require("../../agent/human");
const game_1 = require("./game");
let pvpQueue = [];
exports.addToLobbyQueue = (player) => {
    pvpQueue.push(player);
    evaluateQueue();
};
exports.removeFromQueue = (player) => {
    pvpQueue = pvpQueue.filter((queuePlayer) => queuePlayer != player);
    evaluateQueue();
};
const evaluateQueue = () => {
    console.log("Evaluating queue");
    if (pvpQueue.length < 2)
        return;
    const player1 = pvpQueue.shift();
    const player2 = pvpQueue.shift();
    const agents = [human_1.makeHumanAgent(player1), human_1.makeHumanAgent(player2)];
    console.log(`Agent: ${agents[0]}`);
    game_1.createGame(agents);
};
