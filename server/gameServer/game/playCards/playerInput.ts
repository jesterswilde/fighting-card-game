import { MechanicEnum, Mechanic } from "../../../shared/card";
import { ReadiedEffect, GameState, PredictionState, PredictionEnum } from "../../interfaces/stateInterface";
import { SocketEnum } from "../../../shared/socket";
import { deepCopy, getOpponent, splitArray } from "../../util";
import { Socket } from "socket.io";
import { mechanicsToReadiedEffects } from "../readiedEffects";
import { getPlayerMechanicsReady } from "./playCard";
import { storePlayedCardEvent } from "../events";


export const playersMakeChoices = (state: GameState)=>{
    const promiseArr = state.sockets.map((_, player)=> playerMakesChoices(player, state));
    return Promise.all(promiseArr); 
}

const playerMakesChoices = async (player: number, state: GameState) => {
    await playerPicksCard(player, state);
    storePlayedCardEvent(player, state);
    getPlayerMechanicsReady(player, state); 
    await playerPicksOne(player, state);
    await playerMakesPredictions(player, state);
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
    decks[player].push(...unusedCards);
    hands[player] = [];
    card.opponent = getOpponent(player);
    state.pickedCards[player] = card;
}


const playerPicksOne = async (player: number, state: GameState, { _waitForPlayerToChoose = waitForPlayerToChoose } = {}) => {
    const { sockets } = state;
    const playerEffects = state.readiedEffects[player] || [];
    const pickedEffects: ReadiedEffect[] = [];
    const unusedEffs: boolean[] = [];
    for (let i = 0; i < playerEffects.length; i++) {
        const { mechanic: effect, card, isEventOnly } = playerEffects[i]
        if (effect.mechanic === MechanicEnum.PICK_ONE && !isEventOnly) {
            const socket = sockets[player];
            const choice = await _waitForPlayerToChoose(effect.choices, socket);
            const picked = effect.choices[choice];
            pickedEffects.push({ mechanic: effect, card, isEventOnly: true })
            pickedEffects.push(...mechanicsToReadiedEffects(picked, card, state));
            unusedEffs.push(false);
        } else {
            unusedEffs.push(true);
        }
    }
    state.readiedEffects[player] = playerEffects.filter((_, i) => unusedEffs[i]);
    state.readiedEffects[player].push(...pickedEffects);
}

const waitForPlayerToChoose = (choices: Mechanic[][], player: Socket): Promise<number> => {
    return new Promise((res, rej) => {
        player.emit(SocketEnum.SHOULD_PICK_ONE, choices);
        player.once(SocketEnum.PICKED_ONE, (choice: number) => {
            res(choice);
        })
    })
}

const playerMakesPredictions = async (player: number, state: GameState, { _getPredictions = getPredictions } = {}) => {
    const { readiedEffects = [], sockets } = state;
    const playerEffects = readiedEffects[player] || [];
    for (let i = 0; i < playerEffects.length; i++) {
        const { mechanic: eff, card, isEventOnly } = playerEffects[i];
        if (eff.mechanic === MechanicEnum.PREDICT && !isEventOnly) {
            playerEffects.push({ mechanic: eff, card, isEventOnly: true });
            const prediction: PredictionState = {} as PredictionState;
            const socket = sockets[player];
            prediction.prediction = await _getPredictions(state, socket);
            prediction.card = card;
            prediction.mechanics = deepCopy(eff.mechanicEffects);
            state.predictions = state.predictions || [];
            state.predictions.push(prediction);
        }
    }
}

const getPredictions = (state: GameState, socket: Socket): Promise<PredictionEnum> => {
    return new Promise((res, rej) => {
        socket.emit(SocketEnum.SHOULD_PREDICT);
        socket.once(SocketEnum.MADE_PREDICTION, (prediction: PredictionEnum) => {
            res(prediction);
        })
    })
}

const playerChoosesForce = async (player: number, state: GameState) => {
    const { readiedEffects = [] } = state;
    let playerEffects = readiedEffects[player] || [];
    let [allForcefulArr, unused] = splitArray(playerEffects, ({mechanic})=> mechanic.mechanic === MechanicEnum.FORCEFUL); 
    const validForcefulArr = allForcefulArr.filter(({mechanic})=> state.playerStates[player].poise >= mechanic.amount); 
    const readiedArr: ReadiedEffect[] = []
    for (let i = 0; i < validForcefulArr.length; i++) {
        const { card: { name: cardName }, mechanic, card } = validForcefulArr[i];
        const socket = state.sockets[player];
        const choseToPlay = await getForcefulChoice(socket, mechanic, cardName);
        if (choseToPlay) {
            state.playerStates[player].poise -= typeof mechanic.amount === 'number' ? mechanic.amount : 0;
            readiedArr.push({ mechanic, card, isEventOnly: true })
            const readied = mechanicsToReadiedEffects(mechanic.mechanicEffects, card, state);
            readiedArr.push(...readied);
        }
    }
    state.readiedEffects[player] = [...unused, ...readiedArr];
}

const getForcefulChoice = (socket: Socket, mechanic: Mechanic, cardName: string): Promise<boolean> => {
    return new Promise((res, rej) => {
        socket.emit(SocketEnum.GOT_FORCEFUL_CHOICE, { mechanic, cardName });
        socket.once(SocketEnum.PICKED_FORCEFUL, (useForecful: boolean) => {
            res(useForecful);
        })
    })
}

