
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
    ALTER = "Alter"
}

export enum DisplayEnum {
    REQ_EFF,
    EFF,
    NORMAL,
    NAME,
    NAME_EFF,
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
    [MechanicEnum.ALTER]: DisplayEnum.NAME_EFF,
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