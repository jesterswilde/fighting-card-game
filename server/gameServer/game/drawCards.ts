import { GameState } from "../interfaces/stateInterface";
import { sendHand } from "./socket";
import { ErrorEnum } from "../errors";
import { Card, Enhancement } from "../../shared/card";
import { HAND_SIZE } from "../gameSettings";
import { canPlayCard, canUseOptional } from "./playCards/requirements";
import { getOpponent } from "../util";
import { stat } from "fs";

export const givePlayersCards = (state: GameState, { _sendHand = sendHand } = {}) => {
    try {
        drawHands(state); 
        markOptional(state);
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

export const drawCards = (player:number, state: GameState, handSize = HAND_SIZE) => {
    shuffleDeck(player, state); 
    const deck = state.decks[player];
    let handIndexes: number[] = [];
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
        addEnhancement(card, state); 
        deck[i] = undefined;
        return card;
    })
    state.decks[player] =  state.decks[player].filter((card)=> card !== undefined);
    return hand;
}

const markOptional = (state: GameState) => {
    state.hands.forEach((hand)=>{
        hand.forEach(({ optional = [], opponent, player }) => {
            if (opponent === undefined) {
                opponent = player === 0 ? 1 : 0;
            }
            optional.forEach((opt) => {
                opt.canPlay = canUseOptional(opt, player, opponent, state);
            })
        })
    })
}

export const addEnhancement = (card: Card, state: GameState) => {
    const tags = card.tags || [];
    const modObj = state.tagModification[card.player]
    card.enhancements = tags.reduce((enhArr: Enhancement[], {value:tag})=>{
        const mechanics = modObj[tag] || [];
        enhArr.push({tag, mechanics});
        return enhArr;
    },[])
}

const addPanicCard = (state: GameState) => {
    state.hands.forEach((hand, player)=>{
        if(hand.length === 0){
            const card: Card = {
                name: 'Panic',
                effects: [],
                requirements: [],
                player,
                opponent: getOpponent(player),
                optional: []
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
