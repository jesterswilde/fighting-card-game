import {store} from '../state/store'; 
import { GameState, PredictionEnum } from './interface';
import { GameActionEnum, ReplaceGameAction, StartGameAction, MadePredictionAction, ShouldPickOneAction, DidPickOneAction, ShouldPickForecfulAction, DidPickForcefulAction, SwapCardDisplayModeAction } from './actions';
import { socket } from '../socket/socket';
import { SocketEnum } from '../shared/socket';
import { Mechanic } from '../shared/card';

export const dispatchSwitchCardDisplayMode = (turn: number, player: number, index: number)=>{
    const action: SwapCardDisplayModeAction = {
        type: GameActionEnum.SWAPPED_CARD_DISPLAY_MODE,
        cardLoc: {turn, player, index}
    } 
    store.dispatch(action); 
}

export const dispatchMadePrediction = (prediction: PredictionEnum)=>{
    const action: MadePredictionAction = {
        type: GameActionEnum.MADE_PREDICTION,
        prediction
    }
    socket.emit(SocketEnum.MADE_PREDICTION, prediction); 
    store.dispatch(action); 
}

export const dispatchGameState = (gameState: GameState)=>{
    const action: ReplaceGameAction = {
        type: GameActionEnum.REPLACE_STATE,
        gameState
    }
    store.dispatch(action);
}

export const dispatchStartGame = (player: number)=>{
    const action: StartGameAction = {
        type: GameActionEnum.START_GAME,
        player
    }
    store.dispatch(action); 
}

export const dispatchShouldPickOne = (choices: Mechanic[][])=>{
    const action: ShouldPickOneAction = {
        type: GameActionEnum.SHOULD_PICK_ONE,
        choices
    };
    store.dispatch(action); 
}

export const dispatchDidPickOne = (choice: number)=>{
    const action: DidPickOneAction = {
        type: GameActionEnum.DID_PICK_ONE,
        choice
    };
    console.log("sending picked one"); 
    socket.emit(SocketEnum.PICKED_ONE, choice); 
    store.dispatch(action); 
}

export const dispatchShouldPickForecful = (option: {cardName: string, mechanic: Mechanic})=>{
    const action: ShouldPickForecfulAction = {
        type: GameActionEnum.SHOULD_PICK_FORCEFUL,
        option
    };
    store.dispatch(action); 
}

export const dispatchDidPickForecful = (choice: boolean)=>{
    const action: DidPickForcefulAction = {
        type: GameActionEnum.DID_PICK_FORCEFUL,
        choice
    };
    socket.emit(SocketEnum.PICKED_FORCEFUL, choice); 
    store.dispatch(action);
}