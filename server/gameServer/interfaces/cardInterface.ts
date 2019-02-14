export interface Card extends RequirementEffect{
    name: string,
    optional: Optional[]
    telegraphs?: Mechanic[]
    focuses?: Mechanic[]
    predictions?: Mechanic[]
    shouldReflex?: boolean
    player?: number
    opponent?: number
}

export interface Optional extends RequirementEffect{
    canPlay?: boolean
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
    FORCEFUL = "Forceful",
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
    BLOODIED = "Bloodied",
    MOTION = "Motion",
    DISTANCE = "Distance",
    POISE = "Poise",
    LOSE_POISE = "Lose Poise",
    STANCE = "Stance"

}

export enum PlayerEnum{
    PLAYER,
    OPPONENT,
    BOTH
}