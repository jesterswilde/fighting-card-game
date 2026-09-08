import { AxisEnum, PlayerEnum } from "../shared/card";
import {
  Preferences,
  PreferenceOverrides,
  ResolvedPersona,
  PersonaConfig,
  OutcomePreferences,
} from "./types";

export const DEFAULT_OUTCOMES: OutcomePreferences = {
  selfHealthAboveHalf: 1,
  selfHealthBelowHalf: 1,
  opponentDamage: 1,
  poise: 0.5,
  opponentPoise: -0.5,
  block: 0.15,
  opponentBlock: -0.15,
  setup: 0.25,
  opponentSetup: -0.25,
  handSize: 0.5,
  opponentHandSize: -0.5,
  win: 1000,
  loss: -1000,
};
/** Public, tunable school priors. Missing schools/fields use neutral defaults. No card behavior here. */
export const SCHOOL_PREFERENCES: { [school: string]: PreferenceOverrides } = {
  Grappler: {
    states: [
      { axis: AxisEnum.GRAPPLED, player: PlayerEnum.BOTH, value: 1.5 },
      { axis: AxisEnum.PRONE, player: PlayerEnum.OPPONENT, value: 1 },
    ],
  },
  Finesse: { outcomes: { poise: 0.8, opponentPoise: -0.8 } },
  "Cheap Shot": { outcomes: { opponentDamage: 1.2, selfHealthAboveHalf: 0.8 } },
  "Death From Above": { states: [{ axis: AxisEnum.PRONE, player: PlayerEnum.OPPONENT, value: 1 }] },
  Immovable: { outcomes: { block: 0.3, poise: 0.8 } },
  Unstoppable: { outcomes: { opponentDamage: 1.2, selfHealthAboveHalf: 0.8 } },
};
export function getSchoolPreferences(name: string): Preferences {
  const publicValues = SCHOOL_PREFERENCES[name] || {};
  return {
    cardPreferences: { ...publicValues.cardPreferences },
    outcomes: { ...DEFAULT_OUTCOMES, ...publicValues.outcomes },
    states: (publicValues.states || []).map((s) => ({ ...s })),
  };
}
export function deckPreferences(
  schools: string[],
  overrides: PreferenceOverrides = {},
): Preferences {
  const names = [...new Set(schools)];
  const profiles = (names.length ? names : ["Generic"]).map(getSchoolPreferences);
  const outcomes = {} as OutcomePreferences;
  Object.keys(DEFAULT_OUTCOMES).forEach(
    (key) =>
      (outcomes[key] = profiles.reduce((sum, p) => sum + p.outcomes[key], 0) / profiles.length),
  );
  const cardPreferences: { [name: string]: number } = {};
  const states: Preferences["states"] = [];
  profiles.forEach((profile) => {
    Object.keys(profile.cardPreferences).forEach(
      (name) =>
        (cardPreferences[name] =
          (cardPreferences[name] || 0) + profile.cardPreferences[name] / profiles.length),
    );
    profile.states.forEach((s) => {
      let entry = states.find((v) => v.axis === s.axis && v.player === s.player);
      if (!entry) {
        entry = { ...s, value: 0 };
        states.push(entry);
      }
      entry.value += s.value / profiles.length;
    });
  });
  (overrides.states || []).forEach((s) => {
    const existing = states.find((v) => v.axis === s.axis && v.player === s.player);
    if (existing) {
      existing.value = s.value;
    } else {
      states.push({ ...s });
    }
  });
  const result = {
    outcomes: { ...outcomes, ...overrides.outcomes },
    cardPreferences: { ...cardPreferences, ...overrides.cardPreferences },
    states,
  };
  [
    ...Object.values(result.outcomes),
    ...Object.values(result.cardPreferences),
    ...result.states.map((s) => s.value),
  ].forEach((value) => {
    if (!Number.isFinite(value)) {
      throw new Error("AI preferences must be finite numbers");
    }
  });
  return result;
}
export function resolvePersona(config: PersonaConfig): ResolvedPersona {
  const dice = { ...(config.dice || { count: 1, sides: 3 }) };
  const samples = config.samples === undefined ? 24 : config.samples;
  if (!Number.isInteger(samples) || samples < 1 || samples > 256) {
    throw new Error("samples must be 1..256");
  }
  if (
    !Number.isInteger(dice.count) ||
    dice.count < 0 ||
    dice.count > 100 ||
    !Number.isInteger(dice.sides) ||
    dice.sides < 1 ||
    dice.sides > 1000
  ) {
    throw new Error("Invalid dice pool");
  }
  const weights = { outcomes: 1, pending: 0.5, draw: 0.5, ...config.weights };
  Object.values(weights).forEach((v) => {
    if (!Number.isFinite(v) || v < 0) {
      throw new Error("AI weights must be finite and nonnegative");
    }
  });
  return {
    config,
    preferences: deckPreferences(config.schools, config.overrides),
    dice,
    samples,
    weights,
  };
}
