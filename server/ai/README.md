# Persona AI and tournaments

All AI preferences, observation filtering, scoring, simulation adapters, and tournament orchestration live here. The actual card rules remain in `server/gameServer/game`: rollouts clone a game state, install mock agents, commit both cards, and call the existing turn resolution functions through the next turn's start. Live game objects and their random stream are never used as mutable simulation state.

## Run

From the repository root:

```sh
bun run ai:test
bun run ai:tournament server/ai/example-tournament.json /tmp/tournament-report.json
```

Bun executes these TypeScript files directly. Run `bun run typecheck` to check the server, AI, and both browser projects with the workspace TypeScript compiler. `bun start` also runs source directly; there is no intermediate server build or custom loader.

## Tune a persona

`preferences.ts` contains `SCHOOL_PREFERENCES` and neutral defaults. Public school profiles are exposed through the existing school listing as `aiPreferences`. A deck averages its distinct schools, giving each school equal weight. Missing outcome fields use neutral defaults; missing card and state preferences contribute zero. Persona overrides apply after averaging, including explicit zero values. Initial school values are starting points for experimentation, not calibrated balance conclusions.

`example-tournament.json` provides complete runnable personas. Each persona has:

| Field                       | Meaning                                                                                                                                       |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`, `schools`, `cards`  | Identity, public schools, and actual card-name list. Registered school membership validates the deck, including Generic cards.                |
| `overrides.cardPreferences` | Optional number by card name; defaults to the public school average, normally zero. Separate from the card's rules-level resolution priority. |
| `overrides.outcomes`        | Values for health, opponent damage, poise, defense, setup, hand size, and victory/loss.                                                       |
| `overrides.states`          | Generic requirement entries with a `value`, e.g. `{ "axis": "Prone", "player": "Them", "value": 2 }`.                                         |
| `dice`                      | `{ "count": 1, "sides": 3 }` by default. Zero count disables decision noise.                                                                  |
| `samples`                   | Opponent scenarios per candidate, default 24, allowed 1–256.                                                                                  |
| `weights`                   | Independent `outcomes`, `pending`, and `draw` weights, default 1, 0.5, 0.5.                                                                   |
| `seed`                      | Reproducible persona randomness; tournament seeds also contribute.                                                                            |

For a berserker, use `selfHealthAboveHalf: 0` and `selfHealthBelowHalf: 2` in `overrides.outcomes`. Health utility integrates across the threshold: damage from 55 to 45 out of 100 costs 10 utility, so crossing half is handled without a discontinuity. Other state weights use the same utility function for card decisions and follow-up choices. There are no named-card behavior rules.

## Decision procedure

1. Build an observation containing public state, our hand/deck, public queued effects, and visible opposing cards. Strip opposing hidden hand/deck, committed move, prediction guess, and private persona settings.
2. Sample plausible opposing hands from their public schools using the engine's legal draw rules. Score their options with the average public school profile plus 1d3. This immediate evaluator is the same generic scoring code, with no recursive search. Opponent samples are shared across our candidates and selected without seeing our candidate.
3. For every candidate/scenario, resolve the exchange through the engine. Generic mock agents choose Pick One and Forceful options. Telegraphs, Focus, conflicts, damage, and Reflex resolution use the existing engine.
4. Measure the state utility change, residual public effects, and the best immediate option in a sampled next hand. Average each component across scenarios.
5. Add the candidate's card preference and one dice roll, then select the highest score. Ties use seeded randomness.

```text
score = card preference + dice
      + outcomes weight × mean(resolved utility change)
      + pending weight  × mean(residual effect value)
      + draw weight     × mean(best next-hand option value)
```

Resolved damage is counted once. Pending scoring covers effects left in the queue, and next-hand scoring excludes that queue to avoid crediting the same pending effects again. Terminal results have no pending or draw bonuses. Wins/losses receive configured terminal utility (defaults +1000/−1000).

## Deliberate approximations

- Search resolves one full current exchange, followed by a cheap estimate of next-hand power. It does not play a second adversarial exchange or recursively search a tree.
- Public schools identify a possible pool, not an exact enemy deck. The initial model assumes one copy per school-pool card, excludes active queued/visible cards, and respects observed hand size. It does not infer deck composition or duplicate counts from history.
- Residual Telegraph/Focus value uses an explicit heuristic: 0.75 trigger likelihood when requirements currently hold, otherwise 0.25 per unmet requirement, discounted by queue lifetime. Prediction effects use a neutral 0.25 prior. These are tunable estimates, not measured probabilities.
- Pick One and Forceful decisions are greedy in engine prompt order. Their cheap previews reuse effect/trigger resolution but stop before Reflex continuations; full exchange rollouts resolve Reflex normally. Future-hand estimates share this limitation.
- Prediction selection estimates a likely card's base-effect axis. Unknown future prediction guesses in rollouts default to None. This is intentionally an initial approximation.

## Integration and diagnostics

`makePersonaAgent(config, catalog, opponentSchools)` implements the existing agent interface. Normal VS_AI source now uses `defaults.ts`. Existing story battles still use their legacy random agent: their battle format has no declared public schools, so they have not been silently assigned inferred school profiles.

`runMatch` and `runTournament` are exported from `index.ts`. Tournaments play every pair in both seat orders for each round, with matching seeds. Reports include results, final health, and score components for the most recent decision each turn. Turn limits are counted separately from draws. Unexpected engine errors fail the run; a resolution budget also catches runaway trigger chains.

The small engine hooks provide per-game RNG, quiet logging, bounded resolution, an isolated card catalog, and current public state for follow-up prompts. The state factory is shared by live games and tournaments. Regression fixes cover repeated Pick One effects, equal-priority state-effect handling, zero-sized draws, generated cripple IDs, and the existing Flow axis reference.
