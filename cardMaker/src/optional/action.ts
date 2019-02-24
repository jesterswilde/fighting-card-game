import { Optional } from './interface';

export enum OptionalEnum{
    UPDATED = 'updateOptional',
    DELETED = 'deletedOptioanl',
    ADDED_REQ = 'optAddedReq',
    ADDED_EFF = 'optAddedEff',
} 

export interface OptionalAddedReqAction {
    type: OptionalEnum.ADDED_REQ,
    optId: number,
    reqId: number
}

export interface OptionalAddedEffAction{
    type: OptionalEnum.ADDED_EFF,
    optId: number,
    effId: number
}

export interface UpdatedOptionalAction{
    type: OptionalEnum.UPDATED,
    id: number,
    optional: Optional
}

export interface DeletedOptionalAction{
    type: OptionalEnum.DELETED,
    id: number
}

export type OptionalActions = UpdatedOptionalAction | DeletedOptionalAction | OptionalAddedEffAction | OptionalAddedReqAction; 