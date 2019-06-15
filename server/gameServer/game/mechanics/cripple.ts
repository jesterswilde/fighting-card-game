import { Mechanic, Card } from "../../../shared/card";
import { GameState } from "../../interfaces/stateInterface";
import { getCardByName } from "../playCards/getCards";

/*
    Cripple adds a (bad) card to the opponents deck. 
    Cripple currently uses a special lookup object. This can be found under the getCardByName function (../playCards/getCard)
    This is cuz I'm lazy and I didn't want to have an extra section on the card that said the name that will get printed, and a seperate section that had the name of the card
*/

export const reduceCripple = async (mechanic: Mechanic, card: Card, player: number, opponent: number, state: GameState, { _getCardByName = getCardByName } = {}) => {
    console.log("reducing cripple", player, opponent)
    const { decks } = state;
    const { amount: cardName } = mechanic;
    const deck = decks[opponent];
    if (typeof cardName === 'string') {
        const card = _getCardByName(cardName);
        card.player = opponent;
        card.opponent = player;
        deck.push(card);
    }
}