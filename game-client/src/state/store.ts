import {createStore, combineReducers, Store} from 'redux'; 
import { GameState, DistanceEnum } from '../game/interface';
import { gameReducer } from '../game/reducer';
import { ActionType } from './actionTypes';
import { HandState } from '../hand/interface';
import { handReducer } from '../hand/reducer';
import { displayReducer } from '../display/reducer';
import { DisplayState } from '../display/interface';
import { deckReducer } from '../deck/reducer';
import { DecksState } from '../deck/interfaces';

export interface StoreState{
    game: GameState
    hand: HandState
    display: DisplayState
    deck: DecksState
}    

const rootReducer = combineReducers({
    game: gameReducer,
    hand: handReducer,
    display: displayReducer,
    deck: deckReducer
})



export const store: Store<StoreState, ActionType> = createStore(rootReducer); 