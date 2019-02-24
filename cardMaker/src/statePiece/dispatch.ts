import { StatePiece } from "./interface";
import { UpdateStatePieceAction, StatePieceEnum, DeleteStatePieceAction } from './actions';
import { store } from '../state/store';
import { StatePieceJSON } from '../interfaces/cardJSON';


export const dispatchUpdatedStatePiece = (piece: StatePiece)=>{
    const action: UpdateStatePieceAction = {
        type: StatePieceEnum.UPDATED,
        id: piece.id,
        piece
    }
    store.dispatch(action); 
}

export const diaptchUpdateStatePieceJSON = (pieceJSON: StatePieceJSON)=>{
    if(pieceJSON.id !== undefined){
        const piece: StatePiece = pieceJSON as StatePiece;
        const action: UpdateStatePieceAction = {
            type: StatePieceEnum.UPDATED,
            id: pieceJSON.id,
            piece
        }
        store.dispatch(action); 
    }
}

export const dispatchDeleteStatePiece = (id?: number)=>{
    if(id === undefined){
        console.error("Blank ID when deliting state piece")
        return; 
    }
    const action: DeleteStatePieceAction = {
        type: StatePieceEnum.DELETED,
        id
    }
    store.dispatch(action); 
}