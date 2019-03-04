import { MechanicEnum, AxisEnum, PlayerEnum } from '../shared/card';
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