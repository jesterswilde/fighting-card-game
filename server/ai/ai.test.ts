import {
  AxisEnum,
  PlayerEnum,
  MechanicEnum,
  type Card,
  type Effect,
  type Mechanic,
  type Requirement,
} from "../shared/card";
import type { PersonaConfig } from "./types";
import { drawCards } from "../gameServer/game/drawCards.ts";
import { addCrippleCardToOpponentsDeck } from "../gameServer/game/mechanics/cripple.ts";
import { test, spyOn } from "bun:test";
import { gameLog } from "../gameServer/game/runtime";
import assert from "node:assert/strict";
import { makeGameState } from "../gameServer/game/state.ts";
import { playCards } from "../gameServer/game/playCard.ts";
import { endTurn } from "../gameServer/game/endTurn.ts";
import { startTurn } from "../gameServer/game/startTurn.ts";
import { pickCard } from "../gameServer/game/playCards/playerInput.ts";
import { noopAgent, ownedCard, cloneData, cloneGame, observeGame, receiveHand } from "./state.ts";
import { deckPreferences, resolvePersona, SCHOOL_PREFERENCES } from "./preferences.ts";
import { healthValue, outcomeValue } from "./value.ts";
import { planChoices, simulateExchange } from "./simulation.ts";
import { evaluateDecision, pendingValue, drawValue } from "./policy.ts";
import { seededRandom } from "./random.ts";
import { runTournament } from "./tournament.ts";
import { makePersonaAgent } from "./agent.ts";
import { StandingEnum } from "../gameServer/interfaces/stateInterface.ts";
function card(
  name: string,
  effects: Effect[] = [],
  mechanics: Mechanic[] = [],
  requirements: Requirement[] = [],
  style = "A",
): Card {
  return { name, style, priority: 1, requirements, effects, mechanics, tags: [] };
}
function damage(amount: number, player = PlayerEnum.OPPONENT): Effect {
  return { axis: AxisEnum.DAMAGE, player, amount };
}
function fixture(
  ours: Card[],
  theirs: Card[] = [card("Wait", [], [], [], "B")],
  reserve: Card[] = [],
) {
  const all = [...ours, ...theirs, ...reserve];
  const catalog = Object.fromEntries(all.map((c) => [c.name, c]));
  const state = makeGameState([noopAgent(), noopAgent()]);
  state.quiet = true;
  state.cardCatalog = catalog;
  state.hands = [
    ours.map((c, i) => ownedCard(c, 0, i)),
    theirs.map((c, i) => ownedCard(c, 1, 100 + i)),
  ];
  state.decks = [reserve.map((c, i) => ownedCard(c, 0, 200 + i)), []];
  return { state, catalog };
}
const prefs = () => deckPreferences([]);
const config = (extra: Partial<PersonaConfig> = {}) =>
  resolvePersona({
    name: "Test",
    schools: ["A"],
    cards: ["dummy"],
    samples: 2,
    dice: { count: 0, sides: 1 },
    weights: { outcomes: 1, pending: 0, draw: 0 },
    ...extra,
  });
function observation(f) {
  const view = observeGame(f.state, 0, ["B"], f.catalog);
  receiveHand(
    view,
    f.state.hands.map((hand, p) => (p === 0 ? hand : hand.map(() => null))),
  );
  return view;
}
const snapshot = (s) =>
  JSON.stringify({ ...s, agents: [], random: undefined, cardCatalog: undefined });

test("school preferences average missing values as defaults/zero, deduplicate schools, then apply overrides", () => {
  SCHOOL_PREFERENCES.A = {
    cardPreferences: { Strike: 6 },
    outcomes: { poise: 1 },
    states: [{ axis: AxisEnum.PRONE, player: PlayerEnum.OPPONENT, value: 2 }],
  };
  SCHOOL_PREFERENCES.B = { cardPreferences: { Strike: 0 }, outcomes: { poise: 3 } };
  try {
    const p = deckPreferences(["A", "B", "A"]);
    assert.equal(p.cardPreferences.Strike, 3);
    assert.equal(p.outcomes.poise, 2);
    assert.equal(p.states[0].value, 1);
    assert.equal(
      deckPreferences(["A", "B"], { cardPreferences: { Strike: 0 }, outcomes: { poise: 0 } })
        .cardPreferences.Strike,
      0,
    );
    assert.equal(deckPreferences(["A", "B"], { outcomes: { poise: 0 } }).outcomes.poise, 0);
  } finally {
    delete SCHOOL_PREFERENCES.A;
    delete SCHOOL_PREFERENCES.B;
  }
});
test("berserker health curve charges only damage crossing below half", () => {
  assert.equal(healthValue(55, 100, 0, 2) - healthValue(45, 100, 0, 2), 10);
  assert.equal(healthValue(80, 100, 0, 2) - healthValue(70, 100, 0, 2), 0);
  assert.equal(healthValue(40, 100, 0, 2) - healthValue(30, 100, 0, 2), 20);
});
test("isolated exchange matches engine resolution and does not touch live state or RNG", async () => {
  const f = fixture(
    [card("Strike", [damage(6)])],
    [card("Guard", [{ axis: AxisEnum.BLOCK, player: PlayerEnum.PLAYER, amount: 4 }], [], [], "B")],
  );
  let calls = 0;
  f.state.random = () => {
    calls++;
    return 0.9;
  };
  const before = snapshot(f.state);
  const after = await simulateExchange(f.state, [0, 0], [prefs(), prefs()], 7);
  const direct = cloneGame(f.state, 7);
  pickCard(0, 0, direct);
  pickCard(1, 0, direct);
  await playCards(direct);
  await endTurn(direct);
  await startTurn(direct);
  assert.equal(snapshot(after), snapshot(direct));
  assert.equal(snapshot(f.state), before);
  assert.equal(calls, 0);
});
test("visible enemy Telegraph discourages self-prone through actual damage", async () => {
  const f = fixture([
    card("Safe", [damage(3)]),
    card("Risk", [damage(6), { axis: AxisEnum.PRONE, player: PlayerEnum.PLAYER, amount: 3 }]),
  ]);
  const trap = ownedCard(card("Trap"), 1, 700);
  trap.telegraphs = [
    {
      index: 0,
      mechanic: MechanicEnum.TELEGRAPH,
      requirements: [{ axis: AxisEnum.PRONE, player: PlayerEnum.OPPONENT }],
      effects: [damage(10)],
    },
  ];
  f.state.queue = [[[], [trap]]];
  const report = await evaluateDecision(observation(f), config(), 99);
  assert.equal(report.candidates[report.selected].card, "Safe");
  assert(report.candidates[1].outcomes < 0);
  const after = await simulateExchange(f.state, [1, 0], [prefs(), prefs()], 99);
  assert.equal(after.health[0], 40);
  assert.equal(pendingValue(after, 0, prefs()), 0);
});
test("berserker overrides change willingness to trigger the same enemy trap", async () => {
  const f = fixture([
    card("Safe", [damage(3)]),
    card("Risk", [damage(6), { axis: AxisEnum.PRONE, player: PlayerEnum.PLAYER, amount: 3 }]),
  ]);
  const trap = ownedCard(card("Trap"), 1, 700);
  trap.telegraphs = [
    {
      index: 0,
      mechanic: MechanicEnum.TELEGRAPH,
      requirements: [{ axis: AxisEnum.PRONE, player: PlayerEnum.OPPONENT }],
      effects: [damage(10)],
    },
  ];
  f.state.queue = [[[], [trap]]];
  const personality = config({
    overrides: { outcomes: { selfHealthAboveHalf: 0, selfHealthBelowHalf: 2 } },
  });
  let report = await evaluateDecision(observation(f), personality, 99);
  assert.equal(report.candidates[report.selected].card, "Risk");
  f.state.health[0] = 20;
  report = await evaluateDecision(observation(f), personality, 99);
  assert.equal(report.candidates[report.selected].card, "Safe");
});
test("Pick One evaluates every branch and uses the same visible-hazard evaluator", () => {
  const pick = card(
    "Choose",
    [],
    [
      {
        index: 0,
        mechanic: MechanicEnum.PICK_ONE,
        choices: [
          [damage(2)],
          [damage(8), { axis: AxisEnum.PRONE, player: PlayerEnum.PLAYER, amount: 3 }],
          [damage(4)],
        ],
      },
    ],
  );
  const f = fixture([pick]);
  const trap = ownedCard(card("Trap"), 1, 700);
  trap.telegraphs = [
    {
      index: 0,
      mechanic: MechanicEnum.TELEGRAPH,
      requirements: [{ axis: AxisEnum.PRONE, player: PlayerEnum.OPPONENT }],
      effects: [damage(10)],
    },
  ];
  f.state.queue = [[[], [trap]]];
  assert.equal(planChoices(f.state, f.state.hands[0][0], prefs()).picks[0], 2);
});
test("Forceful charges poise and rejects empty/unaffordable effects", () => {
  const f = fixture([
    card(
      "Force",
      [],
      [
        { index: 0, mechanic: MechanicEnum.FORCEFUL, amount: 2, effects: [damage(3)] },
        { index: 1, mechanic: MechanicEnum.FORCEFUL, amount: 2, effects: [] },
      ],
    ),
  ]);
  assert.equal(
    planChoices(f.state, f.state.hands[0][0], deckPreferences([], { outcomes: { poise: 3 } }))
      .forceful[0],
    false,
  );
  const plan = planChoices(f.state, f.state.hands[0][0], prefs());
  assert.equal(plan.forceful[0], true);
  assert.equal(plan.forceful[1], false);
  f.state.playerStates[0].poise = 1;
  assert.equal(planChoices(f.state, f.state.hands[0][0], prefs()).forceful[0], false);
});
test("multiple Pick One mechanics do not apply an earlier branch twice", async () => {
  const f = fixture([
    card(
      "Two choices",
      [],
      [
        { index: 0, mechanic: MechanicEnum.PICK_ONE, choices: [[damage(1)]] },
        { index: 1, mechanic: MechanicEnum.PICK_ONE, choices: [[damage(2)]] },
      ],
    ),
  ]);
  const after = await simulateExchange(f.state, [0, 0], [prefs(), prefs()], 12);
  assert.equal(after.health[1], 47);
});
test("hidden opponent cards, selected move, deck overrides and RNG cannot affect decision inputs", async () => {
  const f = fixture([card("Strike", [damage(4)]), card("WaitSelf")]);
  const view = observation(f);
  const first = await evaluateDecision(view, config(), 51);
  f.state.hands[1] = [ownedCard(card("Secret", [damage(99)]), 1, 900)];
  f.state.decks[1] = [...f.state.hands[1]];
  f.state.pickedCards[1] = f.state.hands[1][0];
  Object.assign(f.state.agents[1], { privateProfile: { cheat: 999 } });
  f.state.random = () => 0.99;
  const second = await evaluateDecision(observation(f), config(), 51);
  assert.deepEqual(second, first);
  assert(!snapshot(observation(f).state).includes("Secret"));
});
test("next-hand value rewards unlocking a finisher without special card rules", async () => {
  const f = fixture(
    [
      card("Setup", [{ axis: AxisEnum.PRONE, player: PlayerEnum.OPPONENT, amount: 3 }]),
      card("WaitSelf"),
    ],
    undefined,
    [card("Finish", [damage(15)], [], [{ axis: AxisEnum.PRONE, player: PlayerEnum.OPPONENT }])],
  );
  const report = await evaluateDecision(
    observation(f),
    config({ weights: { outcomes: 0, pending: 0, draw: 1 } }),
    12,
  );
  assert.equal(report.candidates[report.selected].card, "Setup");
  assert(report.candidates[0].draw > report.candidates[1].draw);
});
test("terminal outcomes do not score future draws or pending effects", async () => {
  const f = fixture([card("Finish", [damage(99)])]);
  const after = await simulateExchange(f.state, [0, 0], [prefs(), prefs()], 3);
  assert.equal(after.winner, 0);
  assert.equal(outcomeValue(f.state, after, 0, prefs()), 1000);
  assert.equal(drawValue(after, 0, prefs(), 1), 0);
  assert.equal(pendingValue(after, 0, prefs()), 0);
});
test("decision dice do not get averaged away when sample count changes", async () => {
  const f = fixture([card("One"), card("Two")]);
  const a = await evaluateDecision(
    observation(f),
    config({ samples: 1, dice: { count: 2, sides: 6 } }),
    77,
  );
  const b = await evaluateDecision(
    observation(f),
    config({ samples: 5, dice: { count: 2, sides: 6 } }),
    77,
  );
  assert.deepEqual(
    a.candidates.map((c) => c.roll),
    b.candidates.map((c) => c.roll),
  );
  assert(a.candidates.every((c) => c.roll >= 2 && c.roll <= 12));
});
test("same-school duplicate public declarations do not dilute preferences", () => {
  assert.deepEqual(deckPreferences(["Finesse", "Finesse"]), deckPreferences(["Finesse"]));
});
test("matches run headlessly, swap sides, terminate, and reproduce from seeds", async () => {
  const catalog = {
    StrikeA: card("StrikeA", [damage(30)]),
    StrikeB: card("StrikeB", [damage(25)], [], [], "B"),
  };
  const personas = [
    { name: "A", schools: ["A"], cards: ["StrikeA"], samples: 1, dice: { count: 0, sides: 1 } },
    { name: "B", schools: ["B"], cards: ["StrikeB"], samples: 1, dice: { count: 0, sides: 1 } },
  ];
  const a = await runTournament(personas, catalog, 1, 22, 5),
    b = await runTournament(personas, catalog, 1, 22, 5);
  assert.deepEqual(a, b);
  assert.equal(a.matches.length, 2);
  assert.deepEqual(
    a.matches.map((m) => m.names),
    [
      ["A", "B"],
      ["B", "A"],
    ],
  );
  assert(a.matches.every((m) => m.turns <= 5));
});
test("full exchange executes a Reflex continuation and Focus through the engine", async () => {
  const f = fixture(
    [
      card(
        "Chain",
        [damage(2), { axis: AxisEnum.REFLEX, player: PlayerEnum.PLAYER }],
        [{ index: 0, mechanic: MechanicEnum.FOCUS, requirements: [], effects: [damage(3)] }],
      ),
    ],
    undefined,
    [card("Follow", [damage(7)])],
  );
  const after = await simulateExchange(f.state, [0, 0], [prefs(), prefs()], 4);
  assert.equal(after.health[1], 38);
  assert.equal(f.state.health[1], 50);
});
test("zero-sized draws keep all cards in the deck", () => {
  const f = fixture([card("WaitSelf")], undefined, [card("Reserve")]);
  f.state.random = seededRandom(4);
  assert.deepEqual(drawCards(0, f.state, 0), []);
  assert.equal(f.state.decks[0].length, 1);
});
test("Flow from the card catalog increases next-turn hand size", async () => {
  const f = fixture([
    card("Flow card", [{ axis: AxisEnum.FLOW, player: PlayerEnum.PLAYER, amount: 2 }]),
  ]);
  const after = await simulateExchange(f.state, [0, 0], [prefs(), prefs()], 7);
  assert.equal(after.handSizeMod[0], 2);
});
test("generated cripple cards have distinct IDs and do not mutate the catalog", () => {
  const f = fixture([card("WaitSelf")]);
  f.catalog["Crippled Arm"] = card("Crippled Arm");
  const before = JSON.stringify(f.catalog);
  for (let i = 0; i < 2; i++) {
    addCrippleCardToOpponentsDeck(
      { axis: AxisEnum.CRIPPLE, player: PlayerEnum.OPPONENT, detail: "Arm" },
      f.state.hands[0][0],
      0,
      1,
      f.state,
    );
  }
  assert.notEqual(f.state.decks[1][0].id, f.state.decks[1][1].id);
  assert.equal(JSON.stringify(f.catalog), before);
});

test("simulation rejects missing card participants before touching state", () => {
  const f = fixture([card("WaitSelf")]);
  const before = snapshot(f.state);
  assert.throws(() => planChoices(f.state, card("Unowned"), prefs()), /missing participants/);
  assert.equal(snapshot(f.state), before);
});

test("a Pick One without choices fails with a useful error", () => {
  const f = fixture([card("Broken choice", [], [{ index: 0, mechanic: MechanicEnum.PICK_ONE }])]);
  assert.throws(() => planChoices(f.state, f.state.hands[0][0], prefs()), /at least one branch/);
});

test("quiet simulations do not silence another game's logs", () => {
  const f = fixture([card("WaitSelf")]);
  const simulation = cloneGame(f.state);
  f.state.quiet = false;
  const log = spyOn(console, "log").mockImplementation(() => {});
  try {
    gameLog(simulation, "hypothetical turn");
    gameLog(f.state, "live turn");
    assert.deepEqual(log.mock.calls, [["live turn"]]);
  } finally {
    log.mockRestore();
  }
});
