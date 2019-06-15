import { GameState } from "../../interfaces/stateInterface";
import { ControlEnum } from "../../errors";
import { forEachCardInQueue } from "../queue";
import { drawCards } from "../drawCards";
import { Mechanic, Card, MechanicEnum } from "../../../shared/card";
import { EventTypeEnum } from "../../interfaces/gameEvent";

/*
    Reflex is the where you you play the first valid card, after the effects of first card are resolved

*/

export const reduceReflex = (mechanic: Mechanic, card: Card, player: number, opponent: number, state: GameState) => {
    card.shouldReflex = true;
}

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
    let playersToReflex: string[] = state.readiedEffects.map(() => null);
    forEachCardInQueue(state, (card) => {
        //Cards are reflexed one at a time, so even if 2 cards tell you to reflex, you only do it once.
        //But you will then restart the check loop, which will cause the next card to reflex. 
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


const addReflexEffects = (players: string[], state: GameState) => {
    let lastEvent = state.events[state.events.length - 1];
    players.forEach((cardName, playedBy)=>{ //cannot read property events of undefined (lastEvent is null at some point for some reason)
        if(cardName && Array.isArray(lastEvent.events) && lastEvent.events[playedBy] && Array.isArray(lastEvent.events[playedBy].events)){
            lastEvent.events[playedBy].events.push({ type: EventTypeEnum.MECHANIC, mechanicName: MechanicEnum.REFLEX, cardName, playedBy })
        }
    })
}