import { MechanicState } from "./interface";
import { ActionType } from 'src/state/actions';
import { MechanicActionEnum, DeletedMechanicActon } from './actions';
import {reduce} from 'lodash'
import { filterIfHas } from '../utils';
import { StatePieceEnum, DeleteStatePieceAction } from '../statePiece/actions';

export const mechanicReducer = (state: MechanicState, action: ActionType): MechanicState => {
    switch (action.type) {
        case MechanicActionEnum.DELETED:
            return deleted(state, action);
        case MechanicActionEnum.UPDATED:
            return { ...state, mechanicsById: { ...state.mechanicsById, [action.id]: action.mechanic } };
        case StatePieceEnum.DELETED:
            return statePieceDeleted(state, action);
        default:
            return state;
    }
}

export const statePieceDeleted = (state: MechanicState, action: DeleteStatePieceAction): MechanicState => {
    let changed = false;
    const mechanicsById = reduce(state.mechanicsById, (total, current, key) => {
        if (current.mechReq === undefined){
            total[key] = current; 
            return total; 
        }
        const filtered = filterIfHas(current.mechReq, action.id);
        if (filtered !== current.mechReq) {
            changed = true;
            const obj = { ...current, mechReq: filtered };
            total[key] = obj;
            return total;
        }
        total[key] = current;
        return total;
    }, {});
    if (changed) {
        return { ...state, mechanicsById }
    }
    return state;
}

export const deleted = (state: MechanicState, action: DeletedMechanicActon): MechanicState => {
    const mechanicsById = reduce(state.mechanicsById, (total, current, key) => {
        if (Number(key) === action.id) {
            return total;
        }
        const filteredMechEff = filterIfHas(current.mechEff, action.id);
        if (filteredMechEff !== current.mechEff && current.mechEff !== undefined) {
            total[key] = { ...current, mechEff: filteredMechEff }
            return total;
        }
        if (current.choices === undefined) {
            total[key] = current; 
            return total;
        }
        for (let i = 0; i < current.choices.length; i++) {
            const choicesCategory = current.choices[i];
            const filtered = filterIfHas(choicesCategory, action.id);
            if (filtered !== choicesCategory) {
                const choices = [...current.choices];
                choices[i] = filtered;
                total[key] = { ...current, choices }
                return total;
            }
        }
        total[key] = current;
        return total;
    }, {});
    return { ...state, mechanicsById }
}