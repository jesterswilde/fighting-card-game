import { OptionalState } from './interface';
import { ActionType } from '../state/actions';
import { OptionalEnum } from './action';
import {omit, reduce} from 'lodash';
import { MechanicActionEnum, DeletedMechanicActon } from '../mechanic/actions';
import { filterIfHas } from '../utils';
import { DeleteStatePieceAction, StatePieceEnum } from '../statePiece/actions';


export const optionalReducer = (state: OptionalState = { optionalById: {} }, action: ActionType): OptionalState => {
    switch (action.type) {
        case OptionalEnum.UPDATED:
            return { ...state, optionalById: { ...state.optionalById, [action.id]: action.optional } }
        case OptionalEnum.DELETED:
            return { ...state, optionalById: omit(state.optionalById, action.id) }
        case MechanicActionEnum.DELETED:
            return deletedMechanic(state, action);
        case StatePieceEnum.DELETED:
            return deletedStatePiece(state, action); 
        default:
            return state;
    }
}

const deletedStatePiece = (state: OptionalState, action: DeleteStatePieceAction): OptionalState => {
    let didChange = false;
    const modified = reduce(state.optionalById, (total, current, key) => {
        if (current.effects === undefined) {
            total[key] = current;
            return total;
        }
        const filtered = filterIfHas(current.requirements, action.id);
        if (filtered !== current.effects) {
            didChange = true;
            const obj = { ...current, effect: filtered };
            total[key] = obj;
            return total;
        }
        total[key] = current;
        return total;
    }, {})
    if (didChange) {
        return { ...state, optionalById: modified };
    }
    return state;
}

const deletedMechanic = (state: OptionalState, action: DeletedMechanicActon): OptionalState => {
    let didChange = false;
    const modified = reduce(state.optionalById, (total, current, key) => {
        if (current.requirements === undefined) {
            total[key] = current;
            return total;
        }
        const filtered = filterIfHas(current.requirements, action.id);
        if (filtered !== current.requirements) {
            didChange = true;
            const obj = { ...current, requirement: filtered };
            total[key] = obj;
            return total;
        }
        total[key] = current;
        return total;
    }, {})
    if (didChange) {
        return { ...state, optionalById: modified };
    }
    return state;
}
