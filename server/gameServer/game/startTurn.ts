import { GameState } from "../interfaces/stateInterface";
import { sendHand } from "./socket";
import { canPlayCard, canUseOptional } from "./requirements";
import { HAND_SIZE } from "../gameSettings";
import { ErrorEnum } from "../errors";
import { Card } from "../interfaces/cardInterface";
import { SocketEnum } from "../interfaces/socket";

export const startTurn = async (state: GameState) => {
    shuffleDeck(state);
    drawHand(state);
    await playerPicksCard(state);
}


export const drawHand = (state: GameState, { _sendHand = sendHand } = {}) => {
    const { decks, currentPlayer, hands } = state;
    const deck = decks[currentPlayer];
    let handIndexes: number[] = [];
    try {
        for (let i = 0; i < deck.length; i++) {
            if (canPlayCard(deck[i], state)) {
                handIndexes.push(i);
            }
            if (handIndexes.length === HAND_SIZE) {
                break;
            }
        }
        const hand = handIndexes.map((i) => {
            const card = deck[i];
            deck[i] = undefined;
            return card;
        })
        decks[currentPlayer] = decks[currentPlayer].filter((card) => card !== undefined);
        hands[currentPlayer] = hand;
        markOptional(hand, state); 
        if (hand.length === 0) {
            addPanicCard(state);
        }
        _sendHand(state);
    } catch (err) {
        if (err === ErrorEnum.NO_CARD) {
            console.log("No card", deck)
        }else{
            throw err
        }
    }
}

const markOptional = (cards: Card[], state: GameState)=>{
    cards.forEach(({optional = [], opponent, player})=>{
        if(opponent === undefined){
            opponent = player === 0 ? 1 : 0; 
        }
        optional.forEach((opt)=>{
            opt.canPlay = canUseOptional(opt, opponent, state); 
        })
    })
}

const addPanicCard = (state: GameState) => {
    const { currentPlayer: player } = state;
    const card: Card = {
        name: 'Panic',
        effects: [],
        requirements: [],
        player,
        opponent: player === 0 ? 1 : 0,
        optional: []
    }
    state.hands[player].push(card);
}


export const playerPicksCard = async (state: GameState) => {
    const { sockets, currentPlayer: player } = state;
    return new Promise((res, rej) => {
        sockets[player].once(SocketEnum.PICKED_CARD, (index: number) => {
            pickCard(index, state);
            res();
        })
    })
}

export const pickCard = (cardNumber: number, state: GameState) => {
    const { currentPlayer: player, hands, decks } = state;
    state.pickedCard = hands[player][cardNumber];
    const unusedCards = hands[player].filter((_, i) => i !== cardNumber);
    decks[player].push(...unusedCards);
    hands[player] = [];
    const opponent = state.currentPlayer === 0 ? 1 : 0;
    state.pickedCard.opponent = opponent;
}

export const shuffleDeck = (state: GameState, playerToShuffle?: number) => {
    const { decks, currentPlayer: player } = state;

    const deck = decks[player];
    for (let i = 0; i < deck.length; i++) {
        const rand = Math.floor(Math.random() * deck.length);
        const temp = deck[rand];
        deck[rand] = deck[i];
        deck[i] = temp;
    }
}
