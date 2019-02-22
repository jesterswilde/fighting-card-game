import { Optional } from './interface';
import { UpdatedOptionalAction, OptionalEnum, DeletedOptionalAction } from './action';
import { store } from '../state/store';

export const dispatchUpdateOptional = (id: number, optional: Optional)=>{
    const action: UpdatedOptionalAction = {
        type: OptionalEnum.UPDATED,
        id,
        optional
    }
    store.dispatch(action); 
}

export const dispatchDeletedOptional = (id: number)=>{
    const action: DeletedOptionalAction = {
        type: OptionalEnum.DELETED,
        id
    }
    store.dispatch(action); 
}