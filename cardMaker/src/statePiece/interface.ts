import { AxisEnum, PlayerEnum } from '../interfaces/enums';

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