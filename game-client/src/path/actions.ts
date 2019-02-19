export enum PathActionEnum{
    TO_PATH_STRING = 'toPathString',
    TO_PATH_ARRAY = 'toPathArray',
}

export interface ToPathStringAction {
    type: PathActionEnum.TO_PATH_STRING,
    path: string
}

export interface ToPathArrayActon{
    type: PathActionEnum.TO_PATH_ARRAY,
    path: string[], 
}

export type PathActions = ToPathArrayActon | ToPathStringAction; 