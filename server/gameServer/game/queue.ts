import { GameState } from "../interfaces/stateInterface";
import { OwnedCard, assertOwnedCard } from "../../shared/card";
import { QUEUE_LENGTH } from "../gameSettings";

export const forEachCardInQueue = (
  state: GameState,
  cb: (card: OwnedCard, queueIndex: number) => void,
) => {
  state.queue.forEach((queueSlot, queueIndex) => {
    queueSlot.forEach((playerCards, player) => {
      playerCards.forEach((card) => {
        assertOwnedCard(card);
        cb(card, queueIndex);
      });
    });
  });
};
