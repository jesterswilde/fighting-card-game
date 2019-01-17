import { GameState } from "../interfaces/stateInterface";
import { Card, Mechanic } from "../interfaces/cardInterface";
import { canPlayCard } from "./requirements";

export const playGame = async (state: GameState) => {
    startGame(state);
    while (state.winner === undefined) {
        await playTurn(state)
    }
    endGame(state);
}

const startGame = (state: GameState) => {

}

const endGame = (state: GameState) => {

}

export const playTurn = async (state: GameState) => {
    await startTurn(state);
    while (!state.turnOver) {
        await playCard(state);
    }
    endTurn(state);
}

export const startTurn = async (state: GameState) => {
    shuffleDeck(state);
    drawHand(state);
    await playerPicksCard(state);
}

export const endTurn = async (state: GameState) => {
    state.turnOver = false;
}

export const drawHand = (state: GameState) => {
    const {decks, currentPlayer, hands} = state;
    const deck = decks[currentPlayer];  
    let handIndexes: number[] = []; 
    for(let i = 0; i < deck.length; i++){ 
        if(canPlayCard(deck[i], state)){
            handIndexes.push(i); 
        }
        if(handIndexes.length === 3){
            break; 
        }
    }
    const hand = handIndexes.map((i)=>{
        const card = deck[i]; 
        deck[i] = undefined;
        return card; 
    })
    decks[currentPlayer] = decks[currentPlayer].filter((card)=> card !== undefined);
    hands[currentPlayer] = hand; 
}

export const playerPicksCard = async (state: GameState) => {

}

export const pickCard = (cardNumber: number, state: GameState) => {
    const {currentPlayer: player, hands, decks} = state;
    state.pickedCard = hands[player][cardNumber]; 
    const unusedCards = hands[player].filter((_,i)=> i !== cardNumber); 
    decks[player].push(...unusedCards); 
    hands[player] = []; 
}

export const addCardToQueue = (state: GameState) => {

}

export const shuffleDeck = (state: GameState) => {
    const { decks, currentPlayer } = state;
    const deck = decks[currentPlayer];
    for (let i = 0; i < deck.length; i++) {
        const rand = Math.floor(Math.random() * deck.length);
        const temp = deck[rand];
        deck[rand] = deck[i];
        deck[i] = temp;
    }
}

export const playCard = async (state: GameState, { _addCardToQueue = addCardToQueue, _getMechanicsReady = getMechanicsReady, _makePredictions = makePredictions, _storeMechanics = storeMechanics, _applyEffects = applyEffects } = {}) => {
    _getMechanicsReady(state);
    await _makePredictions(state);
    _storeMechanics(state);
    _addCardToQueue(state);
    _applyEffects(state);
}

export const getMechanicsReady = (state: GameState) => {

}

export const makePredictions = async (state: GameState) => {

}

export const makePrediction = (mechanic: Mechanic) => {

}

export const storeMechanics = (state: GameState) => {

}
export const applyEffects = (state: GameState) => {

}