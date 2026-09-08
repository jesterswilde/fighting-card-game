import { assertOwnedCard } from "../shared/card";
import { Card } from "../shared/card";
import { GameState } from "../gameServer/interfaces/stateInterface";
import { HAND_SIZE, QUEUE_LENGTH } from "../gameServer/gameSettings";
import { drawCards, givePlayersCards } from "../gameServer/game/drawCards";
import { markCritical } from "../gameServer/game/mechanics/critical";
import { addEnhacementsToHands } from "../gameServer/game/mechanics/enhance";
import { meetsRequirements } from "../gameServer/game/playCards/requirements";
import { Observation, ResolvedPersona, DecisionReport, Preferences, CardScore } from "./types";
import { cloneGame, ownedCard } from "./state";
import { deckPreferences } from "./preferences";
import { seededRandom, pickHighest, rollDice } from "./random";
import { immediateScore, previewBundle, simulateExchange } from "./simulation";
import { outcomeValue } from "./value";

/** Evaluate every card using the same opponent scenarios, then choose the highest score. */
export async function evaluateDecision(
  observation: Observation,
  persona: ResolvedPersona,
  seed: number,
): Promise<DecisionReport> {
  const decision = createPersonaDecision(observation, persona, seed);
  sampleOpponentChoices(decision);

  for (const cardChoice of decision.cardChoices) {
    applyCardPreference(decision, cardChoice);
    rollCardDice(decision, cardChoice);
    await evaluateCardRollouts(decision, cardChoice);
    sumCardScore(decision, cardChoice);
  }

  return pickBestCard(decision);
}

const panic = (player: number): Card =>
  ownedCard(
    { name: "Panic", effects: [], requirements: [], mechanics: [], isTemporary: true },
    player,
    -1 - player,
  );
function sampleScenario(observation: Observation, seed: number): GameState {
  const state = cloneGame(observation.state, seed),
    other = 1 - observation.player;
  const visible = state.hands[other];
  const size =
    observation.opponentHandSize === undefined
      ? Math.max(0, HAND_SIZE + (state.handSizeMod[other] || 0))
      : observation.opponentHandSize;
  const randomCards = drawCards(
    other,
    state,
    Math.max(0, size - visible.length) - (state.handSizeMod[other] || 0),
  );
  state.hands[other] = visible.concat(randomCards);
  if (!state.hands[other].length) {
    state.hands[other] = [panic(other)];
  }
  markCritical(state);
  addEnhacementsToHands(state);
  return state;
}
/** Intrinsic value of residual public effects. Triggered effects are absent from the queue. */
export function pendingValue(state: GameState, player: number, preferences: Preferences): number {
  if (state.winner !== undefined) {
    return 0;
  }
  let value = 0;
  state.queue.forEach((slot, index) =>
    slot.forEach((cards) =>
      (cards || []).forEach((card) => {
        assertOwnedCard(card);
        [...(card.telegraphs || []), ...(card.focuses || [])].forEach((m) => {
          const reqs = m.requirements || [];
          const missing = reqs.filter(
            (req) => !meetsRequirements(req, state, card.player, card.opponent),
          ).length;
          const chance = missing === 0 ? 0.75 : Math.pow(0.25, missing);
          const lifetime = Math.max(0, (QUEUE_LENGTH - index) / QUEUE_LENGTH);
          const isolated = cloneGame(state);
          isolated.queue = [];
          isolated.predictions = [];
          isolated.pendingPredictions = [];
          const carrier = {
            ...card,
            mechanics: [],
            telegraphs: [],
            focuses: [],
            shouldReflex: false,
          };
          const after = previewBundle(isolated, carrier, m.effects || []);
          value += chance * lifetime * outcomeValue(isolated, after, player, preferences);
        });
      }),
    ),
  );
  // Predictions have four possible categories; this is an explicit neutral prior, not clairvoyance.
  (state.predictions || []).forEach((pred) => {
    if (!pred) {
      return;
    }
    const isolated = cloneGame(state);
    isolated.queue = [];
    isolated.predictions = [];
    isolated.pendingPredictions = [];
    if (pred.readiedEffects.length) {
      const card = pred.readiedEffects[0].card;
      const after = previewBundle(
        isolated,
        { ...card, mechanics: [], telegraphs: [], focuses: [], shouldReflex: false },
        pred.readiedEffects.map((r) => r.effect),
      );
      value += 0.25 * outcomeValue(isolated, after, player, preferences);
    }
  });
  return value;
}
export function drawValue(
  state: GameState,
  player: number,
  preferences: Preferences,
  seed: number,
): number {
  if (state.winner !== undefined) {
    return 0;
  }
  const future = cloneGame(state, seed);
  givePlayersCards(future);
  // Existing pending effects have their own score; do not credit them again in draw power.
  future.queue = [];
  future.predictions = [];
  future.pendingPredictions = [];
  const scores = future.hands[player].map((card) => immediateScore(future, card, preferences));
  return scores.length ? Math.max(...scores) : 0;
}
interface PersonaCardChoice {
  card: Card;
  handIndex: number;
  score: CardScore;
}

interface OpponentScenario {
  state: GameState;
  cardIndex: number;
  seed: number;
}

interface PersonaDecision {
  observation: Observation;
  persona: ResolvedPersona;
  profiles: Preferences[];
  samplingRandom: () => number;
  decisionRandom: () => number;
  scenarios: OpponentScenario[];
  cardChoices: PersonaCardChoice[];
}

function createPersonaDecision(
  observation: Observation,
  persona: ResolvedPersona,
  seed: number,
): PersonaDecision {
  const hand = observation.state.hands[observation.player];
  if (!hand.length) {
    throw new Error("AI received no playable cards");
  }
  const profiles: Preferences[] = [];
  profiles[observation.player] = persona.preferences;
  profiles[1 - observation.player] = deckPreferences(observation.opponentSchools);

  return {
    observation,
    persona,
    profiles,
    samplingRandom: seededRandom(seed),
    decisionRandom: seededRandom(seed ^ 0x53ac1729),
    scenarios: [],
    cardChoices: hand.map((card, handIndex) => ({
      card,
      handIndex,
      score: {
        card: card.name,
        preference: 0,
        outcomes: 0,
        pending: 0,
        draw: 0,
        roll: 0,
        total: 0,
      },
    })),
  };
}

function sampleOpponentChoices(decision: PersonaDecision): void {
  const opponent = 1 - decision.observation.player;
  const preferences = decision.profiles[opponent];

  // Choose once per scenario, without seeing our candidate. Reuse across all cards.
  decision.scenarios = Array.from({ length: decision.persona.samples }, () => {
    const seed = Math.floor(decision.samplingRandom() * 0x100000000);
    const state = sampleScenario(decision.observation, seed);
    const random = seededRandom(seed ^ 0x29473);
    const scores = state.hands[opponent].map(
      (card) => immediateScore(state, card, preferences) + rollDice({ count: 1, sides: 3 }, random),
    );
    return { state, cardIndex: pickHighest(scores, random), seed };
  });
}

function applyCardPreference(decision: PersonaDecision, cardChoice: PersonaCardChoice): void {
  cardChoice.score.preference =
    decision.persona.preferences.cardPreferences[cardChoice.card.name] || 0;
}

function rollCardDice(decision: PersonaDecision, cardChoice: PersonaCardChoice): void {
  // Separate randomness keeps the roll independent of the number of rollout samples.
  cardChoice.score.roll = rollDice(decision.persona.dice, decision.decisionRandom);
}

async function evaluateCardRollouts(
  decision: PersonaDecision,
  cardChoice: PersonaCardChoice,
): Promise<void> {
  const { player } = decision.observation;
  const { preferences, samples, weights } = decision.persona;
  const score = cardChoice.score;

  for (const scenario of decision.scenarios) {
    const choices: [number, number] = [0, 0];
    choices[player] = cardChoice.handIndex;
    choices[1 - player] = scenario.cardIndex;
    const after = await simulateExchange(
      scenario.state,
      choices,
      decision.profiles,
      scenario.seed ^ 0x91a73,
    );

    // Immediate effects are measured in the resolved exchange, so they count only once.
    score.outcomes += outcomeValue(scenario.state, after, player, preferences) / samples;
    if (after.winner !== undefined) {
      continue;
    }
    if (weights.pending) {
      score.pending += pendingValue(after, player, preferences) / samples;
    }
    if (weights.draw) {
      score.draw += drawValue(after, player, preferences, scenario.seed ^ 0xbe973) / samples;
    }
  }
}

function sumCardScore(decision: PersonaDecision, cardChoice: PersonaCardChoice): void {
  const { score } = cardChoice;
  const { weights } = decision.persona;
  score.total =
    score.preference +
    score.roll +
    weights.outcomes * score.outcomes +
    weights.pending * score.pending +
    weights.draw * score.draw;

  if (!Number.isFinite(score.total)) {
    throw new Error("Non-finite AI score for " + cardChoice.card.name);
  }
}

function pickBestCard(decision: PersonaDecision): DecisionReport {
  const candidates = decision.cardChoices.map((cardChoice) => cardChoice.score);
  const opponent = 1 - decision.observation.player;
  return {
    turn: decision.observation.state.turnNumber,
    selected: pickHighest(
      candidates.map((score) => score.total),
      decision.decisionRandom,
    ),
    candidates,
    opponentSamples: decision.scenarios.map(
      (scenario) => scenario.state.hands[opponent][scenario.cardIndex].name,
    ),
  };
}
