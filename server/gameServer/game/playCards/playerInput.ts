import { GameState } from "../../interfaces/stateInterface";
import { SocketEnum } from "../../../shared/socket";
import { getOpponent } from "../../util";
import { getPlayerMechanicsReady } from "./playCard";
import { storePlayedCardEvent } from "../events";
import { playerMakesPredictions } from "../mechanics/predict";
import { playerPicksOne } from "../mechanics/pickOne";
import { playerChoosesForce } from "../mechanics/forceful";
import { removeEnhancements } from "../mechanics/enhance";


export const playersMakeChoices = (state: GameState) => {
    const promiseArr = state.sockets.map((_, player) => playerMakesChoices(player, state));
    return Promise.all(promiseArr);
}

const playerMakesChoices = async (player: number, state: GameState) => {
    await playerMakesPredictions(player, state);
    await playerPicksCard(player, state);
    storePlayedCardEvent(player, state);
    getPlayerMechanicsReady(player, state);
    await playerPicksOne(player, state);
    await playerChoosesForce(player, state);
}

const playerPicksCard = async (player: number, state: GameState) => {
    if (state.hands[player] === undefined || state.hands[player].length === 0) {
        return;
    }
    const { sockets } = state;
    const opponent = getOpponent(player);
    return new Promise((res, rej) => {
        sockets[player].once(SocketEnum.PICKED_CARD, (index: number) => {
            pickCard(player, index, state);
            sockets[opponent].emit(SocketEnum.OPPONENT_PICKED_CARDS);
            res();
        })
    })
}

export const pickCard = (player: number, cardNumber: number, state: GameState) => {
    const { hands, decks } = state;
    const card = hands[player][cardNumber];
    const unusedCards = hands[player].filter((_, i) => i !== cardNumber);
    unusedCards.forEach(removeEnhancements); 
    decks[player].push(...unusedCards);
    hands[player] = [];
    card.opponent = getOpponent(player);
    state.pickedCards[player] = card;
}