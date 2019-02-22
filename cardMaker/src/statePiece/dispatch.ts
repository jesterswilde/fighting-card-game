import { StatePiece } from "./interface";
import { UpdateStatePieceAction, StatePieceEnum, DeleteStatePieceAction } from './actions';
import { store } from 'src/state/store';

export const dispatchUpdatedStatePiece = (id: number, piece: StatePiece)=>{
    const action: UpdateStatePieceAction = {
        type: StatePieceEnum.UPDATED,
        id,
        piece
    }
    store.dispatch(action); 
}

export const dispatchDeletedStatePiece = (id: number)=>{
    const action: DeleteStatePieceAction = {
        type: StatePieceEnum.DELETED,
        id
    }
    store.dispatch(action); 
}