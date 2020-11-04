import { AgentBase, AgentType } from "./interface";
import { Deck } from "../decks/interface";
import {
  GameState,
  PredictionEnum,
} from "../gameServer/interfaces/stateInterface";
import { Card } from "../shared/card";
import { EventAction } from "../gameServer/interfaces/gameEvent";
import { deckListToCards } from "../cards/Cards";

export interface RandomAgent extends AgentBase {
  type: AgentType.RANDOM;
}

const possiblePredictions = [
  PredictionEnum.DISTANCE,
  PredictionEnum.MOTION,
  PredictionEnum.NONE,
  PredictionEnum.STANDING,
];



export const makeRandomAgent = (deck: Card[] = deckListToCards(deckList)): RandomAgent => {
  let currentState: GameState;
  let player = -1;
  let hand: Card[][] = [];
  return {
    type: AgentType.RANDOM,
    username: "Random Randerson",
    deck,
    startGame: (_index: number) => (player = _index),
    gameOver: () => {},
    sendState: (state: GameState) => (currentState = state),
    sendHand: (cards: Card[][]) => (hand = cards),
    sendEvents: (events: EventAction[][]) => {},
    getCardChoice: () => {
      return new Promise<number>((res, rej) => {
        const choice = Math.floor(Math.random() * hand[player].length);
        res(choice);
      });
    },
    opponentMadeCardChoice: () => {},
    getPrediction: () => {
      console.log("Asking ai for prediction"); 
      return new Promise<PredictionEnum>((res, rej) => {
        const choice = Math.floor(Math.random() * possiblePredictions.length);
        res(possiblePredictions[choice]);
      });
    },
    getUsedForceful: (mechOnCard) => {
      return new Promise<boolean>((res, rej) => {
        res(Math.random() > 0.5);
      });
    },
    getPickOneChoice: (mechOnCard) => {
      return new Promise<number>((res, rej) => {
        res(Math.random() > 0.5 ? 0 : 1);
      });
    },
  };
};


const deckList: string[] = [
  'Neck Break',
        'Circle Opponent',
        'Going For The Pin',
        'Leg Grab',
        'Pile Driver',
        'Study Balance',
        'Joint Lock',
        'To The Ground',
        'Defensive Crawl',
        "Throat Jab",
        "Groin Stomp",
        "Going For The High Ground",
        "Rip From Socket",
        "Spring Trap",
        "Makeshift Weapon",
        "Crush",
        "Bite", 
        "Throw Rock",
        'Death From Above',
        'Find The Joint',
        'Grand Setup',
        'The Boot',
        'Face Smash',
        'Ready, Steady',
        'Thrill Seeker',
        'Elbow Drop',
        'Kick Away',
        'Leaping Clothesline'
]