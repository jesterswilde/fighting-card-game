import { Mechanic } from './interface';

export enum MechActionEnum {
    UPDATED = 'updatedMechanic',
    DELETED = 'deletedMechanic',
    ADDED_REQ = 'mechanicAddedReq',
    ADDED_EFF = 'mechanicAddedEff',
    CREATED_CHOICE_CATEGORY = 'mechanicAddedChoiceCategory',
    DELETE_CHOICE_CATEGORY = 'mechanicDeleteChoiceCategory',
    ADDED_CHOICE_TO_CATEGORY = 'mechanicAddedChoiceToCateogry',
}

export interface MechCreatedChoiceAction {
    type: MechActionEnum.CREATED_CHOICE_CATEGORY
    mechId: number
}

export interface MechDeletedChoiceAction {
    type: MechActionEnum.DELETE_CHOICE_CATEGORY,
    mechId: number
    categoryIndex: number
}

export interface MechAddedToChoiceAction{
    type: MechActionEnum.ADDED_CHOICE_TO_CATEGORY,
    parentId: number,
    categoryIndex: number,
    addedId: number
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
export interface UpdatedMechAction {
    type: MechActionEnum.UPDATED,
    id: number,
    mechanic: Mechanic
}

export interface DeletedMechActon {
    type: MechActionEnum.DELETED,
    id: number
}

export type MechActions = UpdatedMechAction | DeletedMechActon | MechAddedEffAction | MechAddedReqAction | 
MechAddedToChoiceAction | MechDeletedChoiceAction | MechCreatedChoiceAction; 