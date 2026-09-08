import { makeGameState } from "../game/state";
import { Agent } from "../../agent";
import { handleDCDuringGame } from "./disconnect";
import { playGame } from "../game/game";
import { GameMods } from "./interface";

export const createGame = async (players: Agent[], gameMods: GameMods | null = null) => {
  const state = makeGameState(players, gameMods);
  handleDCDuringGame(players);
  playGame(state);
};

export { makeGameState } from "../game/state";
