import {store} from '../state/store'; 
import { GameState, PredictionEnum } from './interface';
import { GameActionEnum, ReplaceGameAction, StartGameAction, MadePredictionAction } from './actions';
import { socket } from '../socket/socket';
import { SocketEnum } from '../socket/socketEnum';

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