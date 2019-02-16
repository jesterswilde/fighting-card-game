import { MechanicEnum, Mechanic } from "../../interfaces/cardInterface";
import { ReadiedEffect, GameState, PredictionState, PredictionEnum } from "../../interfaces/stateInterface";
import { mechanicsToReadiedEffects } from "../playCard";
import { SocketEnum } from "../../interfaces/socket";
import { deepCopy } from "../../util";
import { Socket } from "socket.io";

export const playerPicksOne = async (state: GameState, { _waitForPlayerToChoose = waitForPlayerToChoose } = {}) => {
    const { sockets, currentPlayer, readiedEffects = [] } = state;
    const pickedEffects: ReadiedEffect[] = [];
    const unusedEffs: boolean[] = [];
    const player = sockets[currentPlayer];
    for (let i = 0; i < readiedEffects.length; i++) {
        const { mechanic: effect, card } = state.readiedEffects[i]
        if (effect.mechanic === MechanicEnum.PICK_ONE) {
            const choice = await _waitForPlayerToChoose(effect.choices, player);
            const picked = effect.choices[choice];
            pickedEffects.push(...mechanicsToReadiedEffects(picked, card));
            unusedEffs.push(false);
        }
        unusedEffs.push(true);
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
    const { readiedEffects = [] } = state;
    for (let i = 0; i < readiedEffects.length; i++) {
        const { mechanic: eff, card } = readiedEffects[i];
        if (eff.mechanic === MechanicEnum.PREDICT) {
            const prediction: PredictionState = {} as PredictionState;
            prediction.prediction = await _getPredictions(state);
            prediction.card = card;
            prediction.mechanics = deepCopy(eff.mechanicEffects);
            state.predictions = state.predictions || [];
            state.predictions.push(prediction);
            console.log('prediction: ', state.predictions);
        }
    }
}

const getPredictions = (state: GameState): Promise<PredictionEnum> => {
    console.log('getting predictin');
    return new Promise((res, rej) => {
        const { currentPlayer: player, sockets } = state;
        const socket = sockets[player];
        socket.emit(SocketEnum.SHOULD_PREDICT);
        socket.once(SocketEnum.MADE_PREDICTION, (prediction: PredictionEnum) => {
            console.log('gotPrediction');
            res(prediction);
        })
    })
}

export const checkForForecful = async (state: GameState) => {
    const { readiedEffects = [] } = state;
    const options = readiedEffects.filter(({ card: { player }, mechanic: mech }) => {
        const { poise } = state.playerStates[player];
        return mech.mechanic === MechanicEnum.FORCEFUL && poise >= mech.amount;
    })
    //filter out all readied forecful mechanics
    state.readiedEffects = readiedEffects.filter(({ mechanic: mech }) => mech.mechanic !== MechanicEnum.FORCEFUL);
    for (let i = 0; i < options.length; i++) {
        const { card: { player, name: cardName }, mechanic } = options[i];
        const socket = state.sockets[player];
        const choiceToPlay = await getForcefulChoice(socket, mechanic, cardName);
        if (choiceToPlay) {
            const readied = mechanicsToReadiedEffects(mechanic.mechanicEffects, options[i].card);
            state.playerStates[player].poise -= typeof mechanic.amount === 'number' ? mechanic.amount : 0;
            state.readiedEffects.push({
                card: options[i].card,
                mechanic: {mechanic: MechanicEnum.FORCEFUL, amount: mechanic.amount}
            })
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