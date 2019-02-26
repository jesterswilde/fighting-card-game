import { MechanicState } from "./interface";
import { ActionType } from '../state/actions';
import { MechActionEnum, DeletedMechActon, MechAddedEffAction, MechAddedReqAction, MechAddedToChoiceAction } from './actions';
import { reduce } from 'lodash'
import { filterIfHas } from '../utils';
import { StatePieceEnum, DeleteStatePieceAction } from '../statePiece/actions';

export const mechanicReducer = (state: MechanicState = { mechanicsById: {} }, action: ActionType): MechanicState => {
    switch (action.type) {
        case MechActionEnum.DELETED:
            return deleted(state, action);
        case MechActionEnum.UPDATED:
            return { ...state, mechanicsById: { ...state.mechanicsById, [action.id]: action.mechanic } };
        case StatePieceEnum.DELETED:
            return statePieceDeleted(state, action);
        case MechActionEnum.ADDED_EFF:
            return addEff(state, action);
        case MechActionEnum.ADDED_REQ:
            return addReq(state, action);
        case MechActionEnum.CREATED_CHOICE_CATEGORY:
            var choices = [...state.mechanicsById[action.mechId].choices || [], []]
            var mech = { ...state.mechanicsById[action.mechId], choices }
            return { ...state, mechanicsById: { ...state.mechanicsById, [action.mechId]: mech } }
        case MechActionEnum.DELETE_CHOICE_CATEGORY:
            var choices = (state.mechanicsById[action.mechId].choices || []).filter((_, i) => i !== action.categoryIndex);
            var mech = { ...state.mechanicsById[action.mechId], choices };
            return { ...state, mechanicsById: { ...state.mechanicsById, [action.mechId]: mech } }
        case MechActionEnum.ADDED_CHOICE_TO_CATEGORY:
            return addToChoice(state, action);
        default:
            return state;
    }
}

const addToChoice = (state: MechanicState, action: MechAddedToChoiceAction): MechanicState => {
    const choices = [...state.mechanicsById[action.parentId].choices || []]
    const category = [...choices[action.categoryIndex], action.addedId];
    choices[action.categoryIndex] = category;
    const mech = { ...state.mechanicsById[action.parentId], choices }
    return { ...state, mechanicsById: { ...state.mechanicsById, [action.parentId]: mech } }
}

const addReq = (state: MechanicState, { mechId, reqId }: MechAddedReqAction): MechanicState => {
    let mechReq = state.mechanicsById[mechId].mechReq || [];
    mechReq = [...mechReq, reqId]
    const mech = { ...state.mechanicsById[mechId], mechReq };
    return { ...state, mechanicsById: { ...state.mechanicsById, [mechId]: mech } };
}

const addEff = (state: MechanicState, { mechId, effId }: MechAddedEffAction): MechanicState => {
    let mechEff = state.mechanicsById[mechId].mechEff || [];
    mechEff = [...mechEff, effId]
    const mech = { ...state.mechanicsById[mechId], mechEff };
    return { ...state, mechanicsById: { ...state.mechanicsById, [mechId]: mech } };
}

export const statePieceDeleted = (state: MechanicState, action: DeleteStatePieceAction): MechanicState => {
    let changed = false;
    const mechanicsById = reduce(state.mechanicsById, (total, current, key) => {
        if (current.mechReq === undefined) {
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

export const deleted = (state: MechanicState, action: DeletedMechActon): MechanicState => {
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