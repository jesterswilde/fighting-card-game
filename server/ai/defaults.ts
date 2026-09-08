import { Catalog, PersonaConfig } from "./types";
import { schoolPool } from "./state";

/** Reuse the old AI's three-school identity, with the shared public school card lists. */
export function defaultPersona(catalog: Catalog): PersonaConfig {
  const schools = ["Grappler", "Cheap Shot", "Death From Above"];
  return {
    name: "Practice Partner",
    schools,
    cards: schoolPool(schools, catalog, 0).map((c) => c.name),
    dice: { count: 1, sides: 3 },
    samples: 24,
    weights: { outcomes: 1, pending: 0.5, draw: 0.5 },
    seed: 1,
  };
}
