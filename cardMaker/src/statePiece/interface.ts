import { AxisEnum, PlayerEnum } from '../interfaces/enums';
import { getID } from '../utils';

export const makeDefaultStatePiece = (): StatePiece=>{
    return {
        id: getID(),
        axis: AxisEnum.CLOSE,
        player: PlayerEnum.BOTH,
    }
}

export interface StatePiece {
    id: number,
    axis: AxisEnum,
    player: PlayerEnum,
    amount?: number
}

export interface StatePieceState {
    piecesById: {
        [id: number]: StatePiece
    }
}