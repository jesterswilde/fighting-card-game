import { createStore, combineReducers, Store } from 'redux';
import { pathReducer } from '../path/reducer';
import { ActionType } from './actions';
import { CardState } from '../card/interface';
import { StatePieceState } from '../statePiece/interface';
import { MechanicState } from '../mechanic/interface';
import { OptionalState } from '../optional/interface';
import { cardReducer } from '../card/reducer';
import { statePieceReducer } from '../statePiece/reducer';
import { mechanicReducer } from '../mechanic/reducer';
import { optionalReducer } from '../optional/reducer';

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