export enum PathActionEnum{
    TO_PATH_STRING = 'toPathString',
    TO_PATH_ARRAY = 'toPathArray',
    APPEND_TO_PATH = 'appendToPath',
    POP_PATH = 'popPath'
}

export interface AppendToPathAction {
    type: PathActionEnum.APPEND_TO_PATH
    toAppend: string | string[]
}

export interface PopPathAction{
    type: PathActionEnum.POP_PATH
}

export interface ToPathStringAction {
    type: PathActionEnum.TO_PATH_STRING,
    path: string
}

export interface ToPathArrayActon{
    type: PathActionEnum.TO_PATH_ARRAY,
    path: string[], 
}

export type PathActions = ToPathArrayActon | ToPathStringAction | AppendToPathAction | PopPathAction; 