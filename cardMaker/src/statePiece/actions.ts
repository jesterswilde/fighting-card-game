import { StatePiece } from './interface';

export enum StatePieceEnum {
    UPDATED = 'updatedStatePiece',
    DELETED = 'deletedStatePiece'
}

export interface UpdateStatePieceAction{
    type: StatePieceEnum.UPDATED,
    piece: StatePiece,
    id: number
}

export interface DeleteStatePieceAction{
    type: StatePieceEnum.DELETED,
    id: number
}

export type StatePieceActions = UpdateStatePieceAction | DeleteStatePieceAction; 