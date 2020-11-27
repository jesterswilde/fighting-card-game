import {readFile, readdirSync} from "fs";
import { join } from "path"; 
import { makeHumanAgent } from "../../agent/human";
import { makeRandomAgent } from "../../agent/random";
import { deckListToCards } from "../../cards/Cards";
import { createGame } from "../lobby/game";
import { GameMods, PlayerObject } from "../lobby/interface";
import { StoryBattle, StoryInfo } from "./interface";
//NOTE! === The battle JSON must manually match the settings.json (workspace) schema for battles
//THIS IS A VERY ERROR PRONE DECISION, I'm sorry I fucked you on this future me. But you have to understand I was lazy.  


export const startStoryCombat = async(player: PlayerObject, storyInfo: StoryInfo)=>{
    const battle = await loadBattle(storyInfo.battleID); 
    const aiAgent = makeRandomAgent(deckListToCards(battle.enemy.deckList))
    const humanAgent = makeHumanAgent(player, storyInfo.playerVitals.deckList);
    const agents = [humanAgent, aiAgent]
    const health = [storyInfo.playerVitals.health, battle.enemy.health]
    const mods: GameMods = {
        startingPositions: battle.startingPositions,
        health
    }
    createGame(agents, mods); 
}

const loadBattle = (id: string): Promise<StoryBattle>=>{
    return new Promise<StoryBattle>((res, rej)=>{
        readFile(join(__dirname, "..", "..","..", "battles", id+".json"),{ encoding: "utf8" }, (err, data)=>{
            if(err)
                rej(err);
            else
                res(JSON.parse(data))
        })
    })
}