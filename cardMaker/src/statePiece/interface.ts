import { AxisEnum, PlayerEnum } from 'src/interfaces/enums';

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