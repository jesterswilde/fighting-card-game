"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.endGame = void 0;
const events_1 = require("./events");
exports.endGame = (state) => {
    events_1.gameOverEvent(state);
    events_1.sendEvents(state);
    sendGameOver(state);
};
const sendGameOver = async (state) => {
    state.agents.forEach((agent, i) => agent.gameOver(i === state.winner, state));
};
