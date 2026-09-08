import { PersonaConfig, Catalog, DecisionReport } from "./types";
import { makePersonaAgent } from "./agent";
import { makeGameState } from "../gameServer/game/state";
import { playTurn } from "../gameServer/game/game";
import { ControlEnum } from "../gameServer/errors";
import { seededRandom } from "./random";
import { ownedCard } from "./state";

export interface MatchResult {
  names: string[];
  seed: number;
  winner: number | null;
  reason: "victory" | "draw" | "turn-limit";
  turns: number;
  health: number[];
  decisions: Array<{ player: number; report: DecisionReport }>;
}
export async function runMatch(
  configs: [PersonaConfig, PersonaConfig],
  catalog: Catalog,
  seed = 1,
  maxTurns = 100,
): Promise<MatchResult> {
  if (!Number.isInteger(maxTurns) || maxTurns < 1) {
    throw new Error("maxTurns must be positive");
  }
  const agents = configs.map((config, player) =>
    makePersonaAgent(
      { ...config, seed: (config.seed || 0) ^ seed },
      catalog,
      configs[1 - player].schools,
    ),
  );
  const state = makeGameState(agents);
  state.decks = agents.map((agent, player) =>
    (agent.deck || []).map((card) => ownedCard(card, player, state.cardUID++)),
  );
  state.cardCatalog = catalog;
  state.random = seededRandom(seed);
  state.quiet = true;
  agents.forEach((agent, player) => agent.startGame(player));
  const decisions: MatchResult["decisions"] = [];
  const seen: (number | undefined)[] = [undefined, undefined];
  let started = 0;
  while (state.winner === undefined && started < maxTurns) {
    started++;
    state.resolutionBudget = 1000;
    try {
      await playTurn(state);
    } catch (error) {
      if (error !== ControlEnum.GAME_OVER) {
        throw error;
      }
    }
    agents.forEach((agent, player) => {
      const report = agent.getLastDecision?.();
      if (report && report.turn !== seen[player]) {
        decisions.push({ player, report });
        seen[player] = report.turn;
      }
    });
  }
  return {
    names: configs.map((c) => c.name),
    seed,
    winner: state.winner === undefined ? null : state.winner,
    reason: state.winner === undefined ? "turn-limit" : state.winner === -1 ? "draw" : "victory",
    turns: started,
    health: [...state.health],
    decisions,
  };
}
export async function runTournament(
  personas: PersonaConfig[],
  catalog: Catalog,
  rounds = 1,
  seed = 1,
  maxTurns = 100,
) {
  if (!Number.isInteger(rounds) || rounds < 1) {
    throw new Error("rounds must be positive");
  }
  if (new Set(personas.map((p) => p.name)).size !== personas.length) {
    throw new Error("Tournament persona names must be unique");
  }
  const standings = personas.map((p) => ({
    name: p.name,
    wins: 0,
    losses: 0,
    draws: 0,
    turnLimits: 0,
  }));
  const matches: MatchResult[] = [];
  for (let a = 0; a < personas.length; a++) {
    for (let b = a + 1; b < personas.length; b++) {
      for (let round = 0; round < rounds; round++) {
        const matchSeed = (seed + Math.imul(round + 1, 1009) + a * 97 + b * 193) >>> 0;
        for (const order of [
          [a, b],
          [b, a],
        ]) {
          const match = await runMatch(
            [personas[order[0]], personas[order[1]]],
            catalog,
            matchSeed,
            maxTurns,
          );
          matches.push(match);
          if (match.reason === "turn-limit") {
            order.forEach((i) => standings[i].turnLimits++);
          } else if (match.winner === -1) {
            order.forEach((i) => standings[i].draws++);
          } else if (match.winner !== null) {
            standings[order[match.winner]].wins++;
            standings[order[1 - match.winner]].losses++;
          }
        }
      }
    }
  }
  return { standings, matches };
}
