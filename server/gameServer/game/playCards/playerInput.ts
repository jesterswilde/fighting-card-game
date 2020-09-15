import { GameState } from "../../interfaces/stateInterface";
import { SocketEnum } from "../../../shared/socket";
import { getOpponent } from "../../util";
import { readyPlayerEffectsAndMechanics } from "./playCard";
import { playerMakesPredictions } from "../mechanics/predict";
import { playerPicksOne } from "../mechanics/pickOne";
import { playerChoosesForce } from "../mechanics/forceful";
import { removeEnhancements } from "../mechanics/enhance";


export const playersPredictAndPickCards = (state: GameState) => {
    const promiseArr = state.agents.map((_, player) => playerPredictsAndPicksCard(player, state));
    return Promise.all(promiseArr);
}

const playerPredictsAndPicksCard = async (player: number, state: GameState) => {
    await playerMakesPredictions(player, state);
    await playerChoosesCard(player, state);
}

export const playersMakeCardChoices = (state: GameState)=>{
    const promiseArr = state.agents.map((_, player) => playerMakeCardChoices(player, state));
    return Promise.all(promiseArr);
}
const playerMakeCardChoices = async(player: number, state: GameState)=>{
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