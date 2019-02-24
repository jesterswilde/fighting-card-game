import { createStore, combineReducers, Store } from 'redux';
import { GameState, DistanceEnum } from '../game/interface';
import { gameReducer } from '../game/reducer';
import { ActionType } from './actionTypes';
import { HandState } from '../hand/interface';
import { handReducer } from '../hand/reducer';
import { displayReducer } from '../display/reducer';
import { DisplayState } from '../display/interface';
import { lobbyReducer } from '../lobby/reducer';
import { LobbyState } from '../lobby/interfaces';
import { GameDisplayState } from '../gameDisplay/interface';
import { gameDisplayReducer } from '../gameDisplay/reducer';
import { EventState } from '../events/interface';
import { eventReducer } from '../events/reducer';
import { DeckViewerState } from '../deckViewer/interface';
import { pathReducer } from '../path/reducer';
import { socketReducer } from '../socket/reducer';
import { deckViewerReducer } from '../deckViewer/reducer';

export interface StoreState {
    game: GameState
    hand: HandState
    display: DisplayState
    lobby: LobbyState
    gameDisplay: GameDisplayState
    events: EventState,
    path: PathState,
    deckViewer: DeckViewerState,
    socket: SocketState,
}

const rootReducer = combineReducers({
    game: gameReducer,
    hand: handReducer,
    display: displayReducer,
    lobby: lobbyReducer,
    gameDisplay: gameDisplayReducer,
    events: eventReducer,
    deckViewer: deckViewerReducer,
    path: pathReducer,
    socket: socketReducer,
})



export const store: Store<StoreState, ActionType> = createStore(rootReducer); 