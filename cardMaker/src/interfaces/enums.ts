
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

export interface DisplayComponents{
    state?: boolean,
    value?: boolean,
    valueString?: boolean,
    req?: boolean,
    eff?: boolean,
    pick?: boolean,
}

export const getMechDisplay = (mech?: MechanicEnum): DisplayComponents=>{
    const defaultValue: DisplayComponents = {state: true, value: true};
    if(mech === undefined){
        return defaultValue; 
    } 
    const comp = MechanicDisplay[mech]; 
    if(comp){
        return comp; 
    }
    return defaultValue; 
}

const MechanicDisplay: {[mech: string]: DisplayComponents} = {
    [MechanicEnum.TELEGRAPH]: {req: true, eff: true},
    [MechanicEnum.FOCUS]: {req:true, eff: true}, 
    [MechanicEnum.PREDICT]: {eff: true},
    [MechanicEnum.BUFF]: {valueString: true, eff: true},
    [MechanicEnum.ALTER]: {valueString: true, eff: true},
    [MechanicEnum.BLOCK]: {value: true},
    [MechanicEnum.LOCK]: {state: true, value: true},
    [MechanicEnum.REFLEX]: {},
    [MechanicEnum.CRIPPLE]: {valueString: true},
    [MechanicEnum.PICK_ONE]: {pick: true},
    [MechanicEnum.FORCEFUL]: {value: true, eff: true},
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