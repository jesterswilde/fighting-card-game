import { GameState } from "../interfaces/stateInterface";
import { sendHand } from "./send";
import { ErrorEnum } from "../errors";
import { Card, Enhancement, MechanicEnum } from "../../shared/card";
import { HAND_SIZE } from "../gameSettings";
import { canPlayCard } from "./playCards/requirements";
import { getOpponent } from "../util";
import { addEnhacementsToHands } from "./mechanics/enhance";
import { markCritical } from "./mechanics/critical";

export const givePlayersCards = (state: GameState, { _sendHand = sendHand } = {}) => {
    if(state.pickedCards.length > 0 && state.pickedCards.some(card => card != null && card != undefined))
        return; 
    try {
        drawHands(state); 
        markCritical(state);
        addEnhacementsToHands(state); 
        addPanicCard(state);
        _sendHand(state);
    } catch (err) {
        if (err === ErrorEnum.NO_CARD) {
            console.error("No card")
        } else {
            throw err
        }
    }
}

const drawHands = (state: GameState)=>{
    const hands = state.decks.map((_, player)=>{
        const hand = drawCards(player, state);
        return hand;
    })
    state.hands = hands; 
}

export const drawCards = (player:number, state: GameState, defaultHandSize = HAND_SIZE) => {
    shuffleDeck(player, state); 
    const deck = state.decks[player];
    let handIndexes: number[] = [];
    const handSize = defaultHandSize + state.handSizeMod[player] || 0; 
    for (let i = 0; i < deck.length; i++) {
        if (canPlayCard(deck[i], state)) {
            handIndexes.push(i);
        }
        if (handIndexes.length === handSize) {
            break;
        }
    }
    const hand = handIndexes.map((i) => {
        const card = deck[i];
        deck[i] = undefined;
        return card;
    })
    state.decks[player] =  state.decks[player].filter((card)=> card !== undefined);
    return hand;
}




const addPanicCard = (state: GameState) => {
    state.hands.forEach((hand, player)=>{
        if(hand.length === 0){
            const card: Card = {
                name: 'Panic',
                effects: [],
                mechanics: [],
                requirements: [],
                player,
                opponent: getOpponent(player),
                id: state.cardUID++,
                isTemporary: true,
            }
            state.hands[player].push(card);
        }
    })
}



export const shuffleDecks = (state: GameState)=>{
    state.decks.forEach((deck, player)=> shuffleDeck(player, state)); 
}

export const shuffleDeck = (player: number, state: GameState) => {
    const { decks } = state;
    const deck = decks[player];
    for (let i = 0; i < deck.length; i++) {
        const rand = Math.floor(Math.random() * deck.length);
        const temp = deck[rand];
        deck[rand] = deck[i];
        deck[i] = temp;
    }
}
