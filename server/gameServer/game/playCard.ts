import { applyEffects } from "./applyEffects";
import { sendState } from "./socket";
import { ControlEnum } from "../errors";
import { GameState, PredictionState, PredictionEnum } from "../interfaces/stateInterface";
import { deepCopy } from "../util";
import { canUseOptional } from "./requirements";
import { Mechanic, MechanicEnum } from "../interfaces/cardInterface";
import { SocketEnum } from "../interfaces/socket";
import { Socket } from "socket.io";
import { markAxisChange } from "./modifiedAxis";

export const playCard = async (state: GameState) => {
    try {
        getMechanicsReady(state);
        await playerPicksOne(state); 
        await makePredictions(state);
        markAxisChanges(state);
        incrementQueue(state);
        addCardToQueue(state);
        applyEffects(state);
        sendState(state);
    } catch (err) {
        console.log("err", err)
        if (err === ControlEnum.PLAY_CARD) {
            console.log('caught and playing card');
            await playCard(state);
        } else {
            throw err;
        }
    }
}



export const getMechanicsReady = (state: GameState) => {
    const { optional = [], effects = [] } = state.pickedCard;
    const validOptEff = optional.filter((reqEff) => canUseOptional(reqEff, state.pickedCard.opponent, state))
        .reduce((effsArr, reqEffs) => {
            effsArr.push(...reqEffs.effects);
            return effsArr;
        }, [])
    state.readiedEffects = [...deepCopy(effects), ...deepCopy(validOptEff)];
}

export const playerPicksOne = async(state: GameState, {_waitForPlayerToChoose = waitForPlayerToChoose} = {})=>{
    const {sockets, currentPlayer, readiedEffects = []} = state;
    const pickedEffects: Mechanic[] = []; 
    const unusedEffs: boolean[] = [];
    const player = sockets[currentPlayer];
    for(let i = 0; i < readiedEffects.length; i++){
        const effect = state.readiedEffects[i]; 
        if(effect.mechanic === MechanicEnum.PICK_ONE){
            const choice = await _waitForPlayerToChoose(effect.choices, player);
            const picked = effect.choices[choice];
            pickedEffects.push(...picked);
            unusedEffs.push(false); 
        }
        unusedEffs.push(true); 
    }
    state.readiedEffects = state.readiedEffects.filter((_,i)=> unusedEffs[i]);
    state.readiedEffects.push(...pickedEffects); 
}

const waitForPlayerToChoose = (choices: Mechanic[][], player: Socket): Promise<number>=>{
    return new Promise((res, rej)=>{
        player.emit(SocketEnum.SHOULD_PICK_ONE, choices); 
        player.once(SocketEnum.PICKED_ONE, (choice: number)=>{
            res(choice); 
        })
    })
}

export const makePredictions = async (state: GameState, { _getPredictions = getPredictions } = {}) => {
    const { readiedEffects = [] } = state;
    for (let i = 0; i < readiedEffects.length; i++) {
        const eff = readiedEffects[i];
        if (eff.mechanic === MechanicEnum.PREDICT) {
            const prediction: PredictionState = {} as PredictionState;
            prediction.prediction = await _getPredictions(state);
            prediction.mechanics = deepCopy(eff.mechanicEffects);
            prediction.player = state.currentPlayer; 
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


export const incrementQueue = (state: GameState) => {
    const { queue } = state;
    if (!state.incrementedQueue) {
        for (let i = queue.length - 1; i >= 0; i--) {
            queue[i + 1] = queue[i];
        }
        queue[0] = [];
        state.incrementedQueue = true;
    }
}

export const addCardToQueue = (state: GameState) => {
    const { currentPlayer: player, queue } = state;
    const pickedCard = state.pickedCard;
    state.pickedCard = undefined;
    queue[0] = queue[0] || [];
    queue[0].push(pickedCard);
}



export const markAxisChanges = (state: GameState) => {
    const card = state.pickedCard;
    if (state.readiedEffects) {
        state.readiedEffects.forEach((mechanic) => {
            markAxisChange(mechanic, card, state);
        })
    }
}