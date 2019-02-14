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
    amount?: number | string
    choices?: Mechanic[][]
}

export enum MechanicEnum{
    TELEGRAPH = "Telegraph",
    FOCUS = "Focus",
    PREDICT = "Predict",
    BLOCK = "Block",
    LOCK = "Lock",
    REFLEX = "Reflex",
    BUFF = "Buff",
    CRIPPLE = "Cripple",
    PICK_ONE = "Pick One",
    FORCEFUL = "Forceful"
}

export enum DisplayEnum {
    REQ_EFF,
    EFF,
    NORMAL,
    NAME,
    AMOUNT,
    PICK_ONE,
    AMOUNT_EFF,
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
    [MechanicEnum.CRIPPLE]: DisplayEnum.NAME,
    [MechanicEnum.PICK_ONE]: DisplayEnum.PICK_ONE,
    [MechanicEnum.FORCEFUL]: DisplayEnum.AMOUNT_EFF,
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
    POISE = "Poise",
    LOSE_POISE = "Lose Poise",
    BALANCED = "Balanced",
    UNBALANCED = "Unbalanced",
    ANTICIPATING = "Anticipating",
    CLOSER = "Closer",
    FURTHER = "Further",
    BLOODIED = "Bloodied",
}

export enum PlayerEnum{
    PLAYER,
    OPPONENT,
    BOTH
}