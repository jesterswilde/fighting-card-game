import { GameState } from "../../interfaces/stateInterface";
import { ControlEnum } from "../../errors";
import { forEachCardInQueue } from "../queue";
import { MechanicEnum } from "../../../shared/card";
import { drawCards } from "../drawCards";

export const checkReflex = (state: GameState) => {
    const reflexingPlayers = getReflexingPlayers(state);
    const shouldReflex = reflexingPlayers.some((should) => should)
    if (shouldReflex) {
        console.log("player to reflex", reflexingPlayers);
        let didReflex = false;
        reflexingPlayers.forEach((playerWillReflex, player) => {
            if (playerWillReflex) {
                didReflex = true;
                reflexCard(player, state);
            }
        })
        if (didReflex) {
            console.log('did reflex');
            throw ControlEnum.PLAY_CARD;
        }
    }
}

const getReflexingPlayers = (state: GameState) => {
    const { readiedEffects = [] } = state;
    let playersToReflex: boolean[] = state.readiedEffects.map(() => false);
    forEachCardInQueue(state, (card) => {
        const playerEffects = readiedEffects[card.player]
        if (card.shouldReflex && !playersToReflex[card.player]) {
            playerEffects.push({ card, mechanic: { mechanic: MechanicEnum.REFLEX }, isEventOnly: true, isHappening: true })
            console.log("card name: ", card.name, " | ", card.player);
            playersToReflex[card.player] = true;
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
        return true
    } else {
        console.log('reflexed into nothing')
        return false;
    }
}