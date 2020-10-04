import { PlayerObject } from "./interface";
import { makeHumanAgent } from "../../agent/human";
import { createGame } from "./game";

let pvpQueue: PlayerObject[] = [];

export const addToLobbyQueue = (player: PlayerObject) => {
  pvpQueue.push(player);
  evaluateQueue();
};
export const removeFromQueue = (player: PlayerObject) => {
  pvpQueue = pvpQueue.filter((queuePlayer) => queuePlayer != player);
  evaluateQueue();
};

const evaluateQueue = () => {
  console.log("Evaluating queue");
  if (pvpQueue.length < 2) return;
  const player1 = pvpQueue.shift();
  const player2 = pvpQueue.shift();
  const agents = [makeHumanAgent(player1), makeHumanAgent(player2)];
  console.log(`Agent: ${agents[0]}`);

  createGame(agents);
};
