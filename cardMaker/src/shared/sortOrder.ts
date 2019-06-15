import { AxisEnum, MechanicEnum, Card, StatePiece, Mechanic } from "./card";

export const getSortOrder = (mechanic: MechanicEnum | AxisEnum) => {
    const order = SORT_ORDER[mechanic];
    if(order !== undefined){
        return order; 
    }
    return 100; 
}

export const SORT_ORDER = {
    [AxisEnum.DAMAGE]: 0,

    [AxisEnum.BLOODIED]: 1,
    [AxisEnum.FRESH]: 1,

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

    [MechanicEnum.BLOCK]: 10,
    [MechanicEnum.PARRY]: 11,
    [MechanicEnum.CLUTCH]: 12,
    [MechanicEnum.FLUID]: 13,
    [MechanicEnum.RIGID]: 13,

    [MechanicEnum.REFLEX]: 20,
    [MechanicEnum.CRIPPLE]: 21,
    [MechanicEnum.ENHANCE]: 22,
    [MechanicEnum.PREDICT]: 23,
    [MechanicEnum.LOCK]: 24,

    [MechanicEnum.PICK_ONE]: 30,

    [MechanicEnum.FOCUS]: 31,
    [MechanicEnum.TELEGRAPH]: 32,
}

export const sortCard = (card: Card) => {
    if(card.priority === undefined){
        card.priority = 5; 
    }
    sortRequirements(card.requirements);
    sortEffects(card.effects);
    card.optional.forEach((opt) => {
        sortRequirements(opt.requirements);
        sortEffects(opt.effects);
    })
}

const sortRequirements = (reqs: StatePiece[]) => {
    reqs.sort((a, b) => getSortOrder(a.axis) - getSortOrder(b.axis))
}

const sortEffects = (effs: Mechanic[]) => {
    effs.sort((a, b) => {
        let aVal: number, bVal: number;
        if (a.mechanic !== undefined) {
            aVal = getSortOrder(a.mechanic);
        } else {
            aVal = getSortOrder(a.axis);
        }
        if (b.mechanic !== undefined) {
            bVal = getSortOrder(b.mechanic);
        } else {
            bVal = getSortOrder(b.axis);
        }
        return aVal - bVal;
    })
    effs.forEach((eff) => {
        if((eff.axis === AxisEnum.PRONE || eff.axis === AxisEnum.MOVING) && eff.amount === undefined){
            eff.amount = 2; 
        }
        if (Array.isArray(eff.mechanicEffects)) {
            sortEffects(eff.mechanicEffects);
        }
        if (Array.isArray(eff.mechanicRequirements)) {
            sortRequirements(eff.mechanicRequirements);
        }
        if (Array.isArray(eff.choices)) {
            eff.choices.forEach((choice) => {
                sortEffects(choice);
            })
        }
    })
}