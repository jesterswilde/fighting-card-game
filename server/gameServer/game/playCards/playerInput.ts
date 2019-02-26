import { MechanicEnum, Mechanic } from "../../../shared/card";
import { ReadiedEffect, GameState, PredictionState, PredictionEnum } from "../../interfaces/stateInterface";
import { mechanicsToReadiedEffects } from "../playCard";
import { SocketEnum } from "../../../shared/socket";
import { deepCopy } from "../../util";
import { Socket } from "socket.io";

export const playerPicksOne = async (state: GameState, { _waitForPlayerToChoose = waitForPlayerToChoose } = {}) => {
    const { sockets, readiedEffects = [] } = state;
    const pickedEffects: ReadiedEffect[] = [];
    const unusedEffs: boolean[] = [];
    for (let i = 0; i < readiedEffects.length; i++) {
        const { mechanic: effect, card, isEventOnly } = state.readiedEffects[i]
        if (effect.mechanic === MechanicEnum.PICK_ONE && !isEventOnly) {
            const player = sockets[card.player];
            const choice = await _waitForPlayerToChoose(effect.choices, player);
            const picked = effect.choices[choice];
            pickedEffects.push({ mechanic: effect, card, isEventOnly: true })
            pickedEffects.push(...mechanicsToReadiedEffects(picked, card));
            unusedEffs.push(false);
        } else {
            unusedEffs.push(true);
        }
    }
    state.readiedEffects = state.readiedEffects.filter((_, i) => unusedEffs[i]);
    state.readiedEffects.push(...pickedEffects);
}

const waitForPlayerToChoose = (choices: Mechanic[][], player: Socket): Promise<number> => {
    return new Promise((res, rej) => {
        player.emit(SocketEnum.SHOULD_PICK_ONE, choices);
        player.once(SocketEnum.PICKED_ONE, (choice: number) => {
            res(choice);
        })
    })
}

export const makePredictions = async (state: GameState, { _getPredictions = getPredictions } = {}) => {
    const { readiedEffects = [], sockets } = state;
    for (let i = 0; i < readiedEffects.length; i++) {
        const { mechanic: eff, card, isEventOnly } = readiedEffects[i];
        if (eff.mechanic === MechanicEnum.PREDICT && !isEventOnly) {
            readiedEffects.push({ mechanic: eff, card, isEventOnly: true });
            const prediction: PredictionState = {} as PredictionState;
            const player = sockets[card.player];
            prediction.prediction = await _getPredictions(state, player);
            prediction.card = card;
            prediction.mechanics = deepCopy(eff.mechanicEffects);
            state.predictions = state.predictions || [];
            state.predictions.push(prediction);
            console.log('prediction: ', state.predictions);
        }
    }
}

const getPredictions = (state: GameState, socket: Socket): Promise<PredictionEnum> => {
    console.log('getting predictin');
    return new Promise((res, rej) => {
        const { currentPlayer: player, sockets } = state;
        socket.emit(SocketEnum.SHOULD_PREDICT);
        socket.once(SocketEnum.MADE_PREDICTION, (prediction: PredictionEnum) => {
            console.log('gotPrediction');
            res(prediction);
        })
    })
}

export const checkForForecful = async (state: GameState) => {
    console.log('checking forceful');
    const { readiedEffects = [] } = state;
    const options = readiedEffects.filter(({ card: { player }, mechanic: mech, isEventOnly }) => {
        const { poise } = state.playerStates[player];
        return mech.mechanic === MechanicEnum.FORCEFUL && poise >= mech.amount && !isEventOnly;
    })
    //filter out all readied forecful mechanics
    state.readiedEffects = readiedEffects.filter(({ mechanic: mech }) => mech.mechanic !== MechanicEnum.FORCEFUL);
    for (let i = 0; i < options.length; i++) {
        const { card: { player, name: cardName }, mechanic, card } = options[i];
        const socket = state.sockets[player];
        const choiceToPlay = await getForcefulChoice(socket, mechanic, cardName);
        if (choiceToPlay) {
            state.readiedEffects.push({ mechanic, card, isEventOnly: true })
            const readied = mechanicsToReadiedEffects(mechanic.mechanicEffects, card);
            state.playerStates[player].poise -= typeof mechanic.amount === 'number' ? mechanic.amount : 0;
            state.readiedEffects.push(...readied);
        }
    }
}

const getForcefulChoice = (socket: Socket, mechanic: Mechanic, cardName: string): Promise<boolean> => {
    return new Promise((res, rej) => {
        socket.emit(SocketEnum.GOT_FORCEFUL_CHOICE, { mechanic, cardName });
        socket.once(SocketEnum.PICKED_FORCEFUL, (useForecful: boolean) => {
            res(useForecful);
        })
    })
}