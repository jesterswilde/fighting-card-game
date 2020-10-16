export interface Requirement {
  axis: AxisEnum;
  player: PlayerEnum;
}
export interface Effect {
  axis: AxisEnum;
  player: PlayerEnum;
  amount?: number;
  detail?: string;
}
export interface Mechanic {
  index: number;
  mechanic: MechanicEnum;
  requirements?: Requirement[];
  effects?: Effect[];
  amount?: number;
  canPlay?: boolean;
  choices?: Effect[][];
  enhancedTag?: string;
}

export interface Card {
  name: string;
  requirements: Requirement[];
  effects: Effect[];
  mechanics: Mechanic[];
  telegraphs?: Mechanic[];
  focuses?: Mechanic[];
  predictions?: Mechanic[];
  shouldReflex?: boolean;
  player?: number;
  opponent?: number;
  tags?: string[];
  showFullCard?: boolean;
  enhancements?: Enhancement[];
  isFaceUp?: boolean;
  id?: number;
  priority?: number;
  clutch?: number;
  buffed?: number;
  isTemporary?: boolean;
}

export interface Enhancement {
  tag: string;
  effects: Effect[];
}

export enum AxisEnum {
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
  FRESH = "Fresh",
  MOTION = "Motion",
  DISTANCE = "Distance",
  POISE = "Poise",
  LOSE_POISE = "Lose Poise",
  STANCE = "Stance",
  PARRY = "Parry",
  BLOCK = "Block",
  REFLEX = "Reflex",
  CLUTCH = "Clutch",
  SETUP = "Setup",
  RIGID = "Rigid",
  FLUID = "Fluid",
  CRIPPLE = "Cripple",
  BUFF = "Buff",
}

export enum MechanicEnum {
  TELEGRAPH = "Telegraph",
  FOCUS = "Focus",
  PREDICT = "Predict",
  PICK_ONE = "Pick One",
  FORCEFUL = "Forceful",
  ENHANCE = "Enhance",
  CRITICAL = "Critical",
}

export interface DisplayComponents {
  state?: boolean;
  value?: boolean;
  axis?: boolean;
  player?: boolean;
  valueString?: boolean;
  req?: boolean;
  eff?: boolean;
  pick?: boolean;
}

export const getMechDisplay = (mech?: MechanicEnum): DisplayComponents => {
  const defaultValue: DisplayComponents = { state: true, value: true };
  if (mech === undefined) {
    return defaultValue;
  }
  const comp = MechanicDisplay[mech];
  if (comp) {
    return comp;
  }
  return defaultValue;
};

const MechanicDisplay: { [mech: string]: DisplayComponents } = {
  [MechanicEnum.TELEGRAPH]: { req: true, eff: true },
  [MechanicEnum.FOCUS]: { req: true, eff: true },
  [MechanicEnum.PREDICT]: { eff: true },
  [MechanicEnum.ENHANCE]: { valueString: true, eff: true },
  [MechanicEnum.PICK_ONE]: { pick: true },
  [MechanicEnum.FORCEFUL]: { value: true, eff: true },
};

export enum PlayerEnum {
  PLAYER = "Me",
  OPPONENT = "Them",
  BOTH = "Both",
}
