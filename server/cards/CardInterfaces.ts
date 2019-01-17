export interface Card extends RequirementEffect{
    name: string,
    optional: RequirementEffect[]
}

export interface RequirementEffect{
    requirements: StatePiece[],
    effects: Mechanic[]
}

export interface StatePiece{
    axis: AxisEnum,
    player: PlayerEnum,
    amount?: number
}

export interface Mechanic {
    mechanic?: MechanicEnum
    mechanicRequirements?: StatePiece[],
    mechanicEffects?: Mechanic[],
    axis?: AxisEnum,
    player?: PlayerEnum,
    amount?: number
}

export enum MechanicEnum{
    TELEGRAPH = "Telegraph",
    FOCUS = "Focus",
    PREDICT = "Predict",
    BLOCK = "Block",
    LOCK = "Lock",
    REFLEX = "Reflex"
}

export const MechanicHasChildren = {
    [MechanicEnum.TELEGRAPH]: true,
    [MechanicEnum.FOCUS]: true, 
    [MechanicEnum.PREDICT]: true,
    [MechanicEnum.BLOCK]: false, 
    [MechanicEnum.LOCK]: false,
    [MechanicEnum.REFLEX]: false
}

export enum AxisEnum{
    DAMAGE = "Damage",
    PRONE = "Prone",
    STANDING = "Standing",
    MOVING = "Moving",
    STILL = "Still",
    GRAPPLED = "Grappled",
    NOT_GRAPPLED = "Not Grappled",
    CLOSE = "Close",
    NOT_CLOSE = "Not Close",
    FAR = "Far",
    NOT_FAR = "Not Far",
    BALANCED = "Balanced",
    UNBALANCED = "Unbalanced",
    ANTICIPATING = "Anticipating"
}

export enum PlayerEnum{
    PLAYER,
    OPPONENT,
    BOTH
}