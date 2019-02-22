import { Mechanic } from './interface';
import { MechanicActionEnum, UpdatedMechanicAction, DeletedMechanicActon } from './actions';
import { store } from 'src/state/store';

export const dispatchUpdatedMechanic = (id: number, mechanic: Mechanic)=>{
    const action: UpdatedMechanicAction = {
        type: MechanicActionEnum.UPDATED,
        id,
        mechanic
    }
    store.dispatch(action); 
}

export const dispatchDeletedMechanic = (id: number)=>{
    const action: DeletedMechanicActon = {
        type: MechanicActionEnum.DELETED,
        id
    };
    store.dispatch(action); 
}