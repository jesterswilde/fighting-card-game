import { Optional } from './interface';

export enum OptionalEnum{
    UPDATED = 'updateOptional',
    DELETED = 'deletedOptioanl'
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

export type OptionalActions = UpdatedOptionalAction | DeletedOptionalAction; 