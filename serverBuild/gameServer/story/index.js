"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startStoryCombat = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const human_1 = require("../../agent/human");
const random_1 = require("../../agent/random");
const Cards_1 = require("../../cards/Cards");
const game_1 = require("../lobby/game");
//NOTE! === The battle JSON must manually match the settings.json (workspace) schema for battles
//THIS IS A VERY ERROR PRONE DECISION, I'm sorry I fucked you on this future me. But you have to understand I was lazy.  
exports.startStoryCombat = async (player, storyInfo) => {
    const battle = await loadBattle(storyInfo.battleID);
    const aiAgent = random_1.makeRandomAgent(Cards_1.deckListToCards(battle.enemy.deckList));
    const humanAgent = human_1.makeHumanAgent(player, storyInfo.playerVitals.deckList);
    const agents = [humanAgent, aiAgent];
    const health = [storyInfo.playerVitals.health, battle.enemy.health];
    const mods = {
        startingPositions: battle.startingPositions,
        health
    };
    game_1.createGame(agents, mods);
};
const loadBattle = (id) => {
    return new Promise((res, rej) => {
        fs_1.readFile(path_1.join(__dirname, "..", "..", "..", "battles", id + ".json"), { encoding: "utf8" }, (err, data) => {
            if (err)
                rej(err);
            else
                res(JSON.parse(data));
        });
    });
};
