import { Optional } from './interface';
import { UpdatedOptionalAction, OptionalEnum, DeletedOptionalAction, OptionalAddedReqAction, OptionalAddedEffAction } from './action';
import { store } from '../state/store';

export const dispatchOptionalAddReq = (optId: number, reqId: number)=>{
    const action: OptionalAddedReqAction = {
        type: OptionalEnum.ADDED_REQ,
        optId, 
        reqId
    }
    store.dispatch(action); 
}

export const dispatchOptionalAddEff = (optId: number, effId: number)=>{
    const action: OptionalAddedEffAction = {
        type: OptionalEnum.ADDED_EFF,
        optId,
        effId
    }
    store.dispatch(action)
}

export const dispatchUpdateOptional = (id: number, optional: Optional)=>{
    const action: UpdatedOptionalAction = {
        type: OptionalEnum.UPDATED,
        id,
        optional
    }
    store.dispatch(action); 
}

export const dispatchDeletedOptional = (id?: number)=>{
    if(id === undefined) return; 
    const action: DeletedOptionalAction = {
        type: OptionalEnum.DELETED,
        id
    }
    store.dispatch(action); 
}