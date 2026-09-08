import { GameState } from "../gameServer/interfaces/stateInterface";
import { meetsRequirements } from "../gameServer/game/playCards/requirements";
import { STARTING_HEALTH } from "../gameServer/gameSettings";
import { Preferences } from "./types";

export function healthValue(health: number, maximum: number, above: number, below: number): number {
  const h = Math.max(0, Math.min(maximum, health)),
    half = maximum / 2;
  return Math.min(h, half) * below + Math.max(0, h - half) * above;
}
export function stateValue(state: GameState, player: number, preferences: Preferences): number {
  const other = 1 - player,
    p = preferences.outcomes;
  const maximum = state.initialHealth || [STARTING_HEALTH, STARTING_HEALTH];
  const poise = (who: number) => Math.max(0, Math.min(10, state.playerStates[who].poise));
  let value =
    healthValue(
      state.health[player],
      maximum[player],
      p.selfHealthAboveHalf,
      p.selfHealthBelowHalf,
    ) +
    (maximum[other] - Math.max(0, Math.min(maximum[other], state.health[other]))) *
      p.opponentDamage +
    poise(player) * p.poise +
    poise(other) * p.opponentPoise +
    ((state.block[player] || 0) + (state.parry[player] || 0)) * p.block +
    ((state.block[other] || 0) + (state.parry[other] || 0)) * p.opponentBlock +
    ((state.setup[player] || 0) + (state.pendingSetup[player] || 0)) * p.setup +
    ((state.setup[other] || 0) + (state.pendingSetup[other] || 0)) * p.opponentSetup +
    ((state.handSizeMod[player] || 0) + (state.nextHandSizeMod[player] || 0)) * p.handSize +
    ((state.handSizeMod[other] || 0) + (state.nextHandSizeMod[other] || 0)) * p.opponentHandSize;
  preferences.states.forEach((s) => {
    if (meetsRequirements(s, state, player, other)) {
      value += s.value;
    }
  });
  return value;
}
export function outcomeValue(
  before: GameState,
  after: GameState,
  player: number,
  preferences: Preferences,
): number {
  if (after.winner !== undefined) {
    return after.winner === -1
      ? 0
      : after.winner === player
        ? preferences.outcomes.win
        : preferences.outcomes.loss;
  }
  return stateValue(after, player, preferences) - stateValue(before, player, preferences);
}
