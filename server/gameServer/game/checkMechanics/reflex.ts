import { GameState } from "../../interfaces/stateInterface";
import { ControlEnum } from "../../errors";
import { forEachCardInQueue } from "../queue";
import { drawCards } from "../drawCards";
import { addReflexEffects } from "../events";

export const checkReflex = (state: GameState) => {
    const reflexingCards = getReflexingPlayers(state);
    const shouldReflex = reflexingCards.some((should) => should !== null)
    if (shouldReflex) {
        console.log("player to reflex", reflexingCards);
        let didReflex = false;
        reflexingCards.map((playerWillReflex, player) => {
            if (playerWillReflex) {
                didReflex = true;
                reflexCard(player, state);
            }
        })
        if (didReflex) {
            addReflexEffects(reflexingCards, state); 
            console.log('did reflex');
            throw ControlEnum.PLAY_CARD;
        }
    }
}

const getReflexingPlayers = (state: GameState) => {
    const { readiedEffects = [] } = state;
    let playersToReflex: string[] = state.readiedEffects.map(() => null);
    forEachCardInQueue(state, (card) => {
        if (card.shouldReflex && !playersToReflex[card.player]) {
            console.log("card name: ", card.name, " | ", card.player);
            playersToReflex[card.player] = card.name;
            card.shouldReflex = undefined;
        }
    })
    return playersToReflex;
}

const reflexCard = (player: number, state: GameState) => {
    console.log('reflexing');
    const hand = drawCards(player, state, 1);
    if (hand.length > 0) {
        state.pickedCards[player] = hand[0];
        console.log('reflexed into', hand[0].name);
        return hand[0].name;
    } else {
        console.log('reflexed into nothing')
        return null;
    }
}