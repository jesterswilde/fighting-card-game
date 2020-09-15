import { Mechanic, Card, Effect } from "../../../shared/card";
import { GameState } from "../../interfaces/stateInterface";
import { getCardByName } from "../playCards/getCards";

/*
    Cripple adds a (bad) card to the opponents deck. 
    Cripple currently uses a special lookup object. This can be found under the getCardByName function (../playCards/getCard)
    This is cuz I'm lazy and I didn't want to have an extra section on the card that said the name that will get printed, and a seperate section that had the name of the card
*/

export const addCrippleCardToOpponentsDeck = async (effect: Effect, card: Card, player: number, opponent: number, state: GameState, { _getCardByName = getCardByName } = {}) => {
    console.log("reducing cripple", player, opponent)
    const { decks } = state;
    let crippleKey = effect.detail; 
    crippleKey = crippleKey.split(" ")[1]; //just turned "Cripple Leg" into leg which is the lookup key
    const crippleCard = _getCardByName(crippleKey);
    card.player = opponent;
    card.opponent = player;
    decks[opponent].push(crippleCard);
}