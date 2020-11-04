import { GameState } from "../../interfaces/stateInterface";
import { getOpponent } from "../../util";
import { playerMakesPredictions } from "../mechanics/predict";
import { playerPicksOne } from "../mechanics/pickOne";
import { playerChoosesForce } from "../mechanics/forceful";
import { removeEnhancements } from "../mechanics/enhance";
import { some } from "lodash";


export const playersPickCards = (state: GameState) => {
    if(state.pickedCards.length > 0 && state.pickedCards.some(card => card != null && card != undefined))
        return; 
    const promiseArr = state.agents.map((_, player) => playerChoosesCard(player, state));
    return Promise.all(promiseArr);
}

export const playersMakePredictions = (state:GameState)=>{
    const promiseArr = state.agents.map((_, player) => playerMakesPredictions(player, state));
    console.log("Predictions have happeend"); 
    return Promise.all(promiseArr);
}

export const playersMakeCardChoices = (state: GameState)=>{
    const promiseArr = state.agents.map((_,player)=> playerMakesCardChoices(player, state)); 
    return Promise.all(promiseArr); 
}

const playerMakesCardChoices = async(player: number, state:GameState)=>{
    await playerPicksOne(player, state); 
    await playerChoosesForce(player, state); 
}


const playerChoosesCard = async (player: number, state: GameState) => {
    if (state.hands[player] === undefined || state.hands[player].length === 0) {
        return;
    }
    const agent = state.agents[player];
    const opponent = getOpponent(player);
    const cardIndex = await agent.getCardChoice(); 
    pickCard(player, cardIndex, state);
    state.agents[opponent].opponentMadeCardChoice();
}

export const pickCard = (player: number, cardNumber: number, state: GameState) => {
    const { hands, decks } = state;
    const card = hands[player][cardNumber];
    const unusedCards = hands[player].filter((card, i) => i !== cardNumber && card.name !== "Panic");
    unusedCards.forEach(removeEnhancements); 
    decks[player].push(...unusedCards);
    hands[player] = [];
    card.opponent = getOpponent(player);
    state.pickedCards[player] = card;
}