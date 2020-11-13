import { getCardByName } from "../../../cards/Cards";
import { Card, Effect } from "../../../shared/card";
import { GameState } from "../../interfaces/stateInterface";

/*
    Cripple adds a (bad) card to the opponents deck. 
    Cripple currently uses a special lookup object. This can be found under the getCardByName function (../playCards/getCard)
    This is cuz I'm lazy and I didn't want to have an extra section on the card that said the name that will get printed, and a seperate section that had the name of the card
*/

export const addCrippleCardToOpponentsDeck = async (effect: Effect, card: Card, player: number, opponent: number, state: GameState) => {
    const { decks } = state;
    const crippleCard = getCardByName("Crippled " + effect.detail)
    crippleCard.player = opponent;
    crippleCard.opponent = player;
    crippleCard.isFaceUp = true; 
    decks[opponent].push(crippleCard);
}