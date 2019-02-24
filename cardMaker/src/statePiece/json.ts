import { StatePieceJSON } from '../interfaces/cardJSON';
import { StatePiece, makeDefaultStatePiece } from './interface';
import { getID } from '../utils';
import { dispatchUpdatedStatePiece } from './dispatch';

export const statePieceFromJSON = (pieceJSON?: StatePieceJSON): number => {
    let piece: StatePiece;
    if (pieceJSON === undefined) {
        piece = makeDefaultStatePiece(); 
    } else {
        piece = { ...pieceJSON } as StatePiece;
        if (piece.id === undefined) {
            piece.id = getID();
        }
    }
    dispatchUpdatedStatePiece(piece);
    return piece.id;
}