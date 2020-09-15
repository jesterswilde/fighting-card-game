"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interface_1 = require("../../agent/interface");
const queue_1 = require("./queue");
exports.handleDCDuringGame = (players) => {
    players.forEach((agent) => {
        if (agent.type === interface_1.AgentType.HUMAN) {
        }
    });
};
exports.handleDCDuringLobby = (player) => {
    player.socket.removeAllListeners("disconnect");
    player.socket.on("disconnect", (e) => {
        queue_1.removeFromQueue(player);
    });
};
