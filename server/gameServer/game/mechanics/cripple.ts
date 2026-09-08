import { getCardByName } from "../../../cards/Cards";
import { Card, Effect } from "../../../shared/card";
import { deepCopy } from "../../util";
import { GameState } from "../../interfaces/stateInterface";

/*
    Cripple adds a (bad) card to the opponents deck. 
    Cripple currently uses a special lookup object. This can be found under the getCardByName function (../playCards/getCard)
    This is cuz I'm lazy and I didn't want to have an extra section on the card that said the name that will get printed, and a seperate section that had the name of the card
*/

export const addCrippleCardToOpponentsDeck = (
  effect: Effect,
  card: Card,
  player: number,
  opponent: number,
  state: GameState,
) => {
  const { decks } = state;
  const name = "Crippled " + effect.detail;
  const crippleCard = state.cardCatalog ? deepCopy(state.cardCatalog[name]) : getCardByName(name);
  if (!crippleCard) {
    throw new Error("Unknown cripple card: " + name);
  }
  crippleCard.player = opponent;
  crippleCard.opponent = player;
  crippleCard.id = state.cardUID++;
  crippleCard.isFaceUp = true;
  decks[opponent].push(crippleCard);
};
