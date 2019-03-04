import { AxisEnum, MechanicEnum } from "./card";

export const getSortOrder = (mechanic: MechanicEnum)=>{
    const order = SORT_ORDER[mechanic]; 
    return order || 100; 
}

export const SORT_ORDER = {
    [AxisEnum.DAMAGE]: 0,

    [AxisEnum.BLOODIED]: 1,

    [AxisEnum.DISTANCE]: 2,
    [AxisEnum.GRAPPLED]: 2,
    [AxisEnum.CLOSE]: 2,
    [AxisEnum.FAR]: 2,
    [AxisEnum.FURTHER]: 2,
    [AxisEnum.CLOSER]: 2,
    [AxisEnum.NOT_GRAPPLED]: 2,
    [AxisEnum.NOT_CLOSE]: 2,
    [AxisEnum.NOT_FAR]: 2,

    [AxisEnum.POISE]: 3,
    [AxisEnum.LOSE_POISE]: 3,
    [AxisEnum.UNBALANCED]: 3,
    [AxisEnum.BALANCED]: 3,
    [AxisEnum.ANTICIPATING]: 3,
    [AxisEnum.NOT_ANTICIPATING]: 3,

    [AxisEnum.STANCE]: 4,
    [AxisEnum.STANDING]: 4,
    [AxisEnum.PRONE]: 4,

    [AxisEnum.MOTION]: 5,
    [AxisEnum.STILL]: 5,
    [AxisEnum.MOVING]: 5,

    [MechanicEnum.BLOCK]: 6,

    [MechanicEnum.REFLEX]: 7,
    [MechanicEnum.CRIPPLE]: 8,
    [MechanicEnum.ENHANCE]: 8,
    [MechanicEnum.PREDICT]: 9,
    [MechanicEnum.PREDICT]: 9,
    [MechanicEnum.LOCK]: 9,

    [MechanicEnum.PICK_ONE]: 10,

    [MechanicEnum.FOCUS]: 11,
    [MechanicEnum.TELEGRAPH]: 11,
}