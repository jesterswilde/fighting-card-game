import { Mechanic } from './interface';
import { MechActionEnum, UpdatedMechAction, DeletedMechActon, MechAddedReqAction, MechAddedEffAction, MechAddedChoice } from './actions';
import { store } from '../state/store';

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

export const dispatchMechAddChoice = (mechId: number, choiceIndex: number, choiceId: number)=>{
    const action: MechAddedChoice = {
        type: MechActionEnum.ADDED_CHOICE,
        mechId,
        choiceId,
        choiceIndex
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