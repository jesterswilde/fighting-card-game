import { Mechanic } from './interface';
import { MechActionEnum, UpdatedMechAction, DeletedMechActon, MechAddedReqAction, MechAddedEffAction, MechCreatedChoiceAction, MechDeletedChoiceAction, MechAddedToChoiceAction } from './actions';
import { store } from '../state/store';

export const dispatchMechCreatedChoiceCategory = (mechId?: number)=>{
    if(mechId === undefined) return; 
    const action: MechCreatedChoiceAction = {
        type: MechActionEnum.CREATED_CHOICE_CATEGORY,
        mechId
    }
    store.dispatch(action); 
}

export const dispatchMechDeletedChoice = (mechId?: number, categoryIndex?: number)=>{
    if(mechId === undefined || categoryIndex === undefined) return; 
    const action: MechDeletedChoiceAction = {
        type: MechActionEnum.DELETE_CHOICE_CATEGORY,
        mechId,
        categoryIndex
    }
    store.dispatch(action); 
}

export const dispatchMechAddedToChoice = (parentId: number, categoryIndex: number, addedId: number)=>{
    const action: MechAddedToChoiceAction = {
        type: MechActionEnum.ADDED_CHOICE_TO_CATEGORY,
        parentId, 
        categoryIndex,
        addedId
    }
    store.dispatch(action); 
}

export const dispatchMechAddReq = (mechId: number, reqId: number)=>{
    const action: MechAddedReqAction = {
        type: MechActionEnum.ADDED_REQ,
        mechId,
        reqId
    }
    store.dispatch(action); 
}

export const dispatchMechAddEff = (mechId: number, effId: number)=>{
    const action: MechAddedEffAction = {
        type: MechActionEnum.ADDED_EFF,
        mechId,
        effId
    }
    store.dispatch(action); 
}

export const dispatchUpdatedMech = (mechanic: Mechanic)=>{
    const action: UpdatedMechAction = {
        type: MechActionEnum.UPDATED,
        id: mechanic.id,
        mechanic
    }
    store.dispatch(action); 
}

export const dispatchDeletedMech = (id?: number)=>{
    if(id === undefined){
        console.error('tried to delete mech with blank ID'); 
        return; 
    }
    const action: DeletedMechActon = {
        type: MechActionEnum.DELETED,
        id
    };
    store.dispatch(action); 
}