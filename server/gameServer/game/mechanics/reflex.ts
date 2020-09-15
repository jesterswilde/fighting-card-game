import { GameState } from "../../interfaces/stateInterface";
import { ControlEnum } from "../../errors";
import { forEachCardInQueue } from "../queue";
import { drawCards } from "../drawCards";
import { Card, AxisEnum, Effect } from "../../../shared/card";

/*
    Reflex is the where you you play the first valid card, after the effects of first card are resolved

*/

export const markShouldReflexOnQueueCard = (
  effect: Effect,
  card: Card,
  player: number,
  opponent: number,
  state: GameState
) => {
  card.shouldReflex = true;
};

export const checkReflex = (state: GameState) => {
  const reflexingCards = getReflexingCards(state);
  const shouldReflex = reflexingCards.some(should => should !== null);
  if (shouldReflex) {
    console.log("player to reflex", reflexingCards);
    let didReflex = false;
    reflexingCards.forEach((reflexingCardName, player) => {
      if (reflexingCardName !== null) {
        didReflex = true;
        reflexCard(player, state);
      }
    });
    if (didReflex) {
      
      console.log("did reflex");
      throw ControlEnum.PLAY_CARD;
    }
  }
};

const getReflexingCards = (state: GameState) => {
  let cardsToReflex: string[] = state.readiedEffects.map(() => null);
  forEachCardInQueue(state, card => {
    //Cards are reflexed one at a time, so even if 2 cards tell you to reflex, you only do it once.
    //But you will then restart the check loop, which will cause the next card to reflex.
    if (card.shouldReflex && !cardsToReflex[card.player]) {
      console.log("card name: ", card.name, " | ", card.player);
      cardsToReflex[card.player] = card.name;
      card.shouldReflex = undefined;
    }
  });
  return cardsToReflex;
};

const reflexCard = (player: number, state: GameState) => {
  console.log("reflexing");
  const hand = drawCards(player, state, 1);
  if (hand.length > 0) {
    state.pickedCards[player] = hand[0];
    console.log("reflexed into", hand[0].name);
    return hand[0].name;
  } else {
    console.log("reflexed into nothing");
    return null;
  }
};
