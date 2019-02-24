import { MechanicEnum, AxisEnum, PlayerEnum } from '../interfaces/enums';
import { getID } from '../utils';

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

export const makeDefaultMechanic = (): Mechanic=>{
    return {
        id: getID()
    }
}

export interface MechanicState {
    mechanicsById: {
        [id: number]: Mechanic
    }
}