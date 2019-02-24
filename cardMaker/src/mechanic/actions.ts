import { Mechanic } from './interface';

export enum MechActionEnum {
    UPDATED = 'updatedMechanic',
    DELETED = 'deletedMechanic',
    ADDED_REQ = 'mechanicAddedReq',
    ADDED_EFF = 'mechanicAddedEff',
    ADDED_CHOICE = 'mechanicAddedChoice'
}

export interface MechAddedEffAction {
    type: MechActionEnum.ADDED_EFF
    mechId: number
    effId: number,
}

export interface MechAddedReqAction {
    type: MechActionEnum.ADDED_REQ,
    mechId: number,
    reqId: number,
}

export interface MechAddedChoice {
    type: MechActionEnum.ADDED_CHOICE,
    mechId: number,
    choiceIndex: number,
    choiceId: number
}

export interface UpdatedMechAction {
    type: MechActionEnum.UPDATED,
    id: number,
    mechanic: Mechanic
}

export interface DeletedMechActon {
    type: MechActionEnum.DELETED,
    id: number
}

export type MechActions = UpdatedMechAction | DeletedMechActon | MechAddedChoice | MechAddedEffAction | MechAddedReqAction; 