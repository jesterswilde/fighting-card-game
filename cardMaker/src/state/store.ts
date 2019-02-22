import { createStore, combineReducers, Store } from 'redux';
import { pathReducer } from 'src/path/reducer';
import { ActionType } from './actions';
import { CardState } from 'src/card/interface';
import { StatePieceState } from 'src/statePiece/interface';
import { MechanicState } from 'src/mechanic/interface';
import { OptionalState } from 'src/optional/interface';
import { cardReducer } from 'src/card/reducer';
import { statePieceReducer } from 'src/statePiece/reducer';
import { mechanicReducer } from 'src/mechanic/reducer';
import { optionalReducer } from 'src/optional/reducer';

export interface StoreState{
    path: PathState
    card: CardState
    statePiece: StatePieceState
    mechanic: MechanicState
    optional: OptionalState
}

const rootReducer = combineReducers({
    path: pathReducer,
    card: cardReducer,
    statePiece: statePieceReducer,
    mechanic: mechanicReducer,
    optional: optionalReducer
})

export const store: Store<StoreState, ActionType> = createStore(rootReducer)