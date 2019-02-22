import { MechanicEnum, AxisEnum, PlayerEnum } from '../interfaces/enums';

export interface Mechanic {
    id: number,
    mechEnum?: MechanicEnum,
    mechReq?: number[], // StatePiece
    mechEff?: number[], // Mechanic
    choices?: number[][], // Mechanic    
    axis?: AxisEnum,
    player?: PlayerEnum,
    amount?: number | string
}

export interface MechanicState {
    mechanicsById: {
        [id: number]: Mechanic
    }
}