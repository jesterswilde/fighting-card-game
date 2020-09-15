import { Agent } from "../../agent";
import { AgentType } from "../../agent/interface";
import { removeFromQueue } from "./queue";
import { PlayerObject } from "./interface";

export const handleDCDuringGame = (players: Agent[]) => {
    players.forEach((agent) => {
      if (agent.type === AgentType.HUMAN) {
      }
    });
  };
  
export const handleDCDuringLobby = (player: PlayerObject) => {
    player.socket.removeAllListeners("disconnect");
    player.socket.on("disconnect", (e) => {
      removeFromQueue(player); 
    });
  };
  