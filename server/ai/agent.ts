import { AgentType } from "../agent/interface";
import { Card } from "../shared/card";
import { PredictionEnum } from "../gameServer/interfaces/stateInterface";
import { drawCards } from "../gameServer/game/drawCards";
import { MAX_STYLES } from "../config";
import { Catalog, PersonaConfig, PersonaAgent, Observation, DecisionReport } from "./types";
import { resolvePersona, deckPreferences } from "./preferences";
import { cloneData, cloneGame, observeGame, ownedCard, receiveHand, schoolPool } from "./state";
import { evaluateDecision } from "./policy";
import { planChoices, ChoicePlan, choosePrediction } from "./simulation";

export function makePersonaAgent(
  config: PersonaConfig,
  catalog: Catalog,
  opponentSchools: string[],
): PersonaAgent {
  const persona = resolvePersona(cloneData(config));
  const schools = [...new Set(config.schools)];
  if (!schools.length || schools.length > MAX_STYLES) {
    throw new Error("A persona needs 1.." + MAX_STYLES + " schools");
  }
  if (!config.cards.length) {
    throw new Error("A persona needs a nonempty deck");
  }
  const allowed = new Set(schoolPool(schools, catalog, 0).map((c) => c.name));
  const deck = config.cards.map((name, i) => {
    if (!catalog[name] || !allowed.has(name)) {
      throw new Error("Persona card is missing or outside its schools: " + name);
    }
    return ownedCard(catalog[name], 0, i);
  });
  let player = -1,
    observation: Observation | undefined,
    selectedCard: Card | null | undefined,
    plan: ChoicePlan | undefined,
    report: DecisionReport | undefined,
    decisions = 0;
  const seed = config.seed === undefined ? 1 : config.seed;
  const requireObservation = () => {
    if (!observation) {
      throw new Error("Persona needs a public state before deciding");
    }
    return observation;
  };
  const choicePlan = (name: string) => {
    requireObservation();
    if (!selectedCard || selectedCard.name !== name) {
      throw new Error("Follow-up does not match the persona's selected card");
    }
    if (!plan) {
      plan = planChoices(requireObservation().state, selectedCard, persona.preferences);
    }
    return plan;
  };
  return {
    type: AgentType.PERSONA,
    username: config.name,
    schools,
    deck,
    startGame: (index) => {
      player = index;
      decisions = 0;
      observation = undefined;
      selectedCard = undefined;
      plan = undefined;
      report = undefined;
    },
    gameOver: () => {},
    sendEvents: () => {},
    opponentMadeCardChoice: () => {},
    sendState: (state) => {
      if (player < 0) {
        throw new Error("Persona was not started");
      }
      observation = observeGame(state, player, opponentSchools, catalog);
    },
    sendHand: (hands) => {
      requireObservation();
      receiveHand(requireObservation(), hands);
    },
    sendChoiceState: (state) => {
      observation = observeGame(state, player, opponentSchools, catalog);
      // The acting player is entitled to know its own committed card, never the opponent's.
      selectedCard = cloneData(state.pickedCards[player]);
      plan = undefined;
    },
    getCardChoice: async () => {
      requireObservation();
      const snapshot = cloneData(requireObservation());
      snapshot.state.cardCatalog = catalog;
      report = await evaluateDecision(
        snapshot,
        persona,
        (seed + Math.imul(++decisions, 0x9e3779b1)) >>> 0,
      );
      selectedCard = cloneData(requireObservation().state.hands[player][report.selected]);
      plan = undefined;
      return report.selected;
    },
    getPickOneChoice: async (mechanic) => {
      const choice = choicePlan(mechanic.cardName).picks[mechanic.index];
      if (choice === undefined) {
        throw new Error("Unknown Pick One mechanic");
      }
      return choice;
    },
    getUsedForceful: async (mechanic) => !!choicePlan(mechanic.cardName).forceful[mechanic.index],
    getPrediction: async () => {
      requireObservation();
      const guess = cloneGame(
        requireObservation().state,
        seed ^ requireObservation().state.turnNumber ^ 0xa91,
      );
      guess.hands[1 - player] = drawCards(1 - player, guess);
      return choosePrediction(guess, player, deckPreferences(opponentSchools));
    },
    getLastDecision: () => cloneData(report),
  };
}
