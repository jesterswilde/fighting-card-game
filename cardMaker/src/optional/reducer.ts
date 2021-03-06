import { OptionalState } from './interface';
import { ActionType } from '../state/actions';
import { OptionalEnum, OptionalAddedEffAction, OptionalAddedReqAction } from './action';
import {omit, reduce} from 'lodash';
import { MechActionEnum, DeletedMechActon } from '../mechanic/actions';
import { filterIfHas } from '../utils';
import { DeleteStatePieceAction, StatePieceEnum } from '../statePiece/actions';

export const optionalReducer = (state: OptionalState = { optionalById: {} }, action: ActionType): OptionalState => {
    switch (action.type) {
        case OptionalEnum.UPDATED:
            return { ...state, optionalById: { ...state.optionalById, [action.id]: action.optional } }
        case OptionalEnum.DELETED:
            return { ...state, optionalById: omit(state.optionalById, action.id) }
        case MechActionEnum.DELETED:
            return deletedMechanic(state, action);
        case StatePieceEnum.DELETED:
            return deletedStatePiece(state, action);
        case OptionalEnum.ADDED_EFF:
            return addedEff(state, action); 
        case OptionalEnum.ADDED_REQ:
            return addedReq(state, action); 
        default:
            return state;
    }
}


const addedReq = (state: OptionalState, action: OptionalAddedReqAction): OptionalState=>{
    const opt = {...state.optionalById[action.optId]};
    const requirements = [...opt.requirements, action.reqId]; 
    opt.requirements = requirements; 
    return {...state, optionalById: {...state.optionalById, [action.optId]: opt}}
}

const addedEff = (state: OptionalState, action: OptionalAddedEffAction): OptionalState=>{
    const opt = {...state.optionalById[action.optId]};
    const effects = [...opt.effects, action.effId]; 
    opt.effects = effects; 
    return {...state, optionalById: {...state.optionalById, [action.optId]: opt}}
}

const deletedStatePiece = (state: OptionalState, action: DeleteStatePieceAction): OptionalState => {
    let didChange = false;
    const modified = reduce(state.optionalById, (total, current, key) => {
        if (current.requirements === undefined) {
            total[key] = current;
            return total;
        }
        const filtered = filterIfHas(current.requirements, action.id);
        if (filtered !== current.requirements) {
            didChange = true;
            const obj = { ...current, requirements: filtered };
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

const deletedMechanic = (state: OptionalState, action: DeletedMechActon): OptionalState => {
    let didChange = false;
    const modified = reduce(state.optionalById, (total, current, key) => {
        if (current.effects === undefined) {
            total[key] = current;
            return total;
        }
        const filtered = filterIfHas(current.effects, action.id);
        if (filtered !== current.effects) {
            didChange = true;
            const obj = { ...current, effects: filtered };
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
