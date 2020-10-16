import { AgentBase, AgentType } from "./interface";
import {
  PredictionEnum,
  QueueCard,
  HandCard,
} from "../gameServer/interfaces/stateInterface";
import { SocketEnum, GameOverEnum } from "../shared/socket";
import { deckListToCards } from "../cards/Cards";
import { PlayerObject } from "../gameServer/lobby/interface";
import { Card } from "../shared/card";
import { eventsToFrontend } from "./helpers/events";

export interface HumanAgent extends AgentBase {
  type: AgentType.HUMAN;
  player: PlayerObject;
}

export const makeHumanAgent = (player: PlayerObject): HumanAgent => {
  let index = -1;
  return {
    deck: deckListToCards(player.deck.deckList),
    username: player.username,
    type: AgentType.HUMAN,
    player,
    startGame: (_index: number) => {
      index = _index;
      player.socket.emit(SocketEnum.START_GAME, { player: index });
    },
    gameOver: () => {
      player.socket.emit(SocketEnum.GAME_OVER);
      player.socket.once(SocketEnum.END_GAME_CHOICE, (choice: GameOverEnum) => {
        switch (choice) {
          case GameOverEnum.FIND_NEW_OPP_WITH_NEW_DECK:
            break;
          case GameOverEnum.FIND_NEW_OPP_WITH_SAME_DECK:
            break;
        }
      });
    },
    sendHand: (cards) => {
      player.socket.emit(SocketEnum.GOT_CARDS, processHandCard(cards));
    },
    sendState: (state) => {
      player.socket.emit(SocketEnum.GOT_STATE, {
        numPlayers: state.numPlayers,
        queue: processQueueCards(state.queue),
        health: state.health,
        block: state.block,
        playerStates: state.playerStates,
        distance: state.distance,
        setup: state.setup,
        predictions: state.predictions,
        turnNumber: state.turnNumber,
        stateDurations: state.stateDurations,
      });
    },
    sendEvents: (events) => {
      player.socket.emit(SocketEnum.GOT_EVENTS, eventsToFrontend(events));
    },
    getPickOneChoice: (cardName, mechIndex) => {
      return new Promise<number>((res, rej) => {
        player.socket.emit(SocketEnum.SHOULD_PICK_ONE, { cardName, mechIndex });
        player.socket.emit(SocketEnum.PICKED_ONE, (choice: number) => {
          res(choice);
        });
      });
    },
    getPrediction: () => {
      return new Promise<PredictionEnum>((res, rej) => {
        player.socket.emit(SocketEnum.SHOULD_PREDICT);
        console.log("Asked for prediction"); 
        player.socket.once(
          SocketEnum.MADE_PREDICTION,
          (prediction: PredictionEnum) => {
            res(prediction);
          }
        );
      });
    },
    getUsedForceful: (cardName, mechIndex) => {
      return new Promise<boolean>((res, rej) => {
        player.socket.emit(SocketEnum.GOT_FORCEFUL_CHOICE, {
          cardName,
          mechIndex,
        });
        player.socket.once(
          SocketEnum.PICKED_FORCEFUL,
          (useForceful: boolean) => {
            res(useForceful);
          }
        );
      });
    },
    getCardChoice: () => {
      return new Promise<number>((res, rej) => {
        player.socket.once(SocketEnum.PICKED_CARD, (num) => res(num));
      });
    },
    opponentMadeCardChoice: () => {},
  };
};

const processHandCard = (bothHands: Card[][]): HandCard[][] => {
  return bothHands.map((hand) => {
    return hand.map((card) => {
      if (!card) return null;
      const handCard: HandCard = {
        name: card.name,
      };
      //IMPLEMENT MAKRING CRITICALS && ADDING ENCHANCEMENTS AND BUFFS, THEY SHOUDL BE HANDLED IN THE MECHANICS FILE
      return handCard;
    });
  });
};

const processQueueCards = (queue: Card[][][]): QueueCard[][][] => {
  return queue.map((turn) => {
    return turn.map((playerCards) => {
      return playerCards.map(cardToQueueCard);
    });
  });
};

const cardToQueueCard = (card: Card): QueueCard => {
  const queueCard: QueueCard = {
    name: card.name,
  };
  const activeMechanics: number[] = [];
  if (card.telegraphs && card.telegraphs.length > 0)
    activeMechanics.push(...card.telegraphs.map((mech) => mech.index));
  if (card.focuses && card.focuses.length > 0)
    activeMechanics.push(...card.focuses.map((mech) => mech.index));
  return queueCard;
};
