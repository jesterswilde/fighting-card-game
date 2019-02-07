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
import { GameDisplayState } from '../gameDisplay/interface';
import { gameDisplayReducer } from '../gameDisplay/reducer';
import { EventState } from '../events/interface';
import { eventReducer } from '../events/reducer';

export interface StoreState{
    game: GameState
    hand: HandState
    display: DisplayState
    deck: DecksState
    gameDisplay: GameDisplayState,
    events: EventState
}    

const rootReducer = combineReducers({
    game: gameReducer,
    hand: handReducer,
    display: displayReducer,
    deck: deckReducer, 
    gameDisplay: gameDisplayReducer,
    events: eventReducer
})



export const store: Store<StoreState, ActionType> = createStore(rootReducer); 