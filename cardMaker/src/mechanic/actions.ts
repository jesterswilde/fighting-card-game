import { Mechanic } from './interface';

export enum MechanicActionEnum {
    UPDATED = 'updatedMechanic',
    DELETED = 'deletedMechanic'
}

export interface UpdatedMechanicAction{
    type: MechanicActionEnum.UPDATED,
    id: number,
    mechanic: Mechanic
}

export interface DeletedMechanicActon{
    type: MechanicActionEnum.DELETED,
    id: number
}

export type MechanicActions = UpdatedMechanicAction | DeletedMechanicActon; 