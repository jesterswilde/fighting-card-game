export interface Card extends RequirementEffect{
    name: string,
    optional: Optional[]
    telegraphs?: Mechanic[]
    focuses?: Mechanic[]
    predictions?: Mechanic[]
    shouldReflex?: boolean
    player?: number
    opponent?: number
    tags?: TagObj[]
    showFullCard?: boolean
    enhancements?: Enhancement[]
    isFaceUp?: boolean
    id?: number
    priority?: number
    clutch?: number
}

export interface Enhancement {
    tag: string
    mechanics: Mechanic[]
}

export interface TagObj {
    id?: number,
    value: string
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

export interface StatePiece{
    axis: AxisEnum,
    player: PlayerEnum,
    amount?: number
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
    NOT_ANTICIPATING = "Not Anticipating",
    CLOSER = "Closer",
    FURTHER = "Further",
    BLOODIED = "Bloodied",
    MOTION = "Motion",
    DISTANCE = "Distance",
    POISE = "Poise",
    LOSE_POISE = "Lose Poise",
    STANCE = "Stance",
}

export enum MechanicEnum{
    TELEGRAPH = "Telegraph",
    FOCUS = "Focus",
    PREDICT = "Predict",
    PARRY = "Parry",
    BLOCK = "Block",
    LOCK = "Lock",
    REFLEX = "Reflex",
    BUFF = "Buff",
    CRIPPLE = "Cripple",
    PICK_ONE = "Pick One",
    FORCEFUL = "Forceful",
    ENHANCE = "Enhance",
    CLUTCH = 'Clutch',
    SETUP = "Setup",
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
    console.log('mech',mech);
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
    [MechanicEnum.ENHANCE]: {valueString: true, eff: true},
    [MechanicEnum.BLOCK]: {value: true},
    [MechanicEnum.PARRY]: {value: true},
    [MechanicEnum.LOCK]: {state: true, value: true},
    [MechanicEnum.REFLEX]: {},
    [MechanicEnum.CRIPPLE]: {valueString: true},
    [MechanicEnum.PICK_ONE]: {pick: true},
    [MechanicEnum.FORCEFUL]: {value: true, eff: true},
    [MechanicEnum.CLUTCH]: {value: true},
    [MechanicEnum.SETUP]: {value: true},
}


export enum PlayerEnum{
    PLAYER,
    OPPONENT,
    BOTH
}