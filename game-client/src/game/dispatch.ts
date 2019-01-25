import {store} from '../state/store'; 
import { GameState } from './interface';
import { GameActionEnum, ReplaceGameAction, StartGameAction } from './actions';

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