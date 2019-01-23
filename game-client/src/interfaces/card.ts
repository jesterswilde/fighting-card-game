export interface Card extends RequirementEffect{
    name: string,
    optional: RequirementEffect[]
    telegraphs?: Mechanic[]
    focuses?: Mechanic[]
    predictions?: Mechanic[]
    shouldReflex?: boolean
    player?: number
    opponent?: number
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
    mechanic?: MechanicEnum,
    mechanicRequirements?: StatePiece[],
    mechanicEffects?: Mechanic[],
    axis?: AxisEnum,
    player?: PlayerEnum,
    amount?: number | string,
}

export enum MechanicEnum{
    TELEGRAPH = "Telegraph",
    FOCUS = "Focus",
    PREDICT = "Predict",
    BLOCK = "Block",
    LOCK = "Lock",
    REFLEX = "Reflex",
    BUFF = "Buff",
    CRIPPLE = "Cripple"
}

export enum DisplayEnum {
    REQ_EFF,
    EFF,
    NORMAL,
    NAME,
    AMOUNT,
    NONE
}

export const MechanicDisplay = {
    [MechanicEnum.TELEGRAPH]: DisplayEnum.REQ_EFF,
    [MechanicEnum.FOCUS]: DisplayEnum.REQ_EFF, 
    [MechanicEnum.PREDICT]: DisplayEnum.EFF,
    [MechanicEnum.BUFF]: DisplayEnum.NORMAL,
    [MechanicEnum.BLOCK]: DisplayEnum.AMOUNT, 
    [MechanicEnum.LOCK]: DisplayEnum.NORMAL,
    [MechanicEnum.REFLEX]: DisplayEnum.NONE,
    [MechanicEnum.CRIPPLE]: DisplayEnum.NAME
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
    ANTICIPATING = "Anticipating",
    CLOSER = "Closer",
    FURTHER = "Further",
    BLOODIED = "Bloodied"
}

export enum PlayerEnum{
    PLAYER,
    OPPONENT,
    BOTH
}