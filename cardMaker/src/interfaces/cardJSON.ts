import { TagObj,  MechanicEnum, AxisEnum, PlayerEnum  } from '../shared/card';


export interface CardJSON extends RequirementEffectJSON{
    name: string,
    optional: RequirementEffectJSON[]
    tags: TagObj[]
    priority?: number
}

export interface MechanicJSON{
    id?: number
    mechanic?: MechanicEnum
    mechanicRequirements?: StatePieceJSON[],
    mechanicEffects?: MechanicJSON[],
    axis?: AxisEnum,
    player?: PlayerEnum,
    amount?: number | string
    choices?: MechanicJSON[][]
}

export interface RequirementEffectJSON{
    id?: number
    requirements: StatePieceJSON[],
    effects: MechanicJSON[]
}

export interface StatePieceJSON{
    id?: number
    axis: AxisEnum,
    player: PlayerEnum,
    amount?: number
}

