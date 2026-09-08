import { GameState } from "../interfaces/stateInterface";

/** Per-game hooks keep simulations isolated from live randomness and logging. */
export const gameLog = (state: GameState, ...values: unknown[]) => {
  if (!state.quiet) {
    console.log(...values);
  }
};
export const resolutionStep = (state: GameState) => {
  if (state.resolutionBudget !== undefined && --state.resolutionBudget < 0) {
    throw new Error("Game resolution budget exceeded (possible effect/reflex loop)");
  }
};
