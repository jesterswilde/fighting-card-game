import { createStore, combineReducers, Store, StoreEnhancer } from 'redux'; 
import { GameState } from '../game/interface';
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
import { DeckEditState} from '../deckBuilder/interface'; 
import { pathReducer } from '../path/reducer';
import { socketReducer } from '../socket/reducer';
import { deckViewerReducer } from '../deckViewer/reducer';
import { FightingStyleState } from '../fightingStyles/interface';
import { fightingStyleReducer } from '../fightingStyles/reducer';
import { UserState } from '../user/interface';
import { loadState } from './localStorage';
import { userReducer } from '../user/reducer';
import { deckEditorReducer } from '../deckBuilder/reducer';

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
    fightingStyle: FightingStyleState,
    user: UserState,
    deckEditor: DeckEditState,
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
    fightingStyle: fightingStyleReducer,
    user: userReducer,
    deckEditor: deckEditorReducer,
})

const devToolsExtension: StoreEnhancer = window['devToolsExtension'] ?
  window['devToolsExtension']() : f => f;

const loadedState = loadState(); 

export const store: Store<StoreState, ActionType> = createStore(rootReducer, loadedState, devToolsExtension);