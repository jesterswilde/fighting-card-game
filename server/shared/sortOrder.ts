import { AxisEnum, MechanicEnum, Mechanic } from "./card";

export const getAxisGroup = (mechanic: MechanicEnum | AxisEnum) => {
  const order = SORT_ORDER[mechanic];
  if (order !== undefined) {
    return order;
  }
  return 100;
};
export enum SortAxisEnum {
  DAMAGE = 0,
  FRESH_OR_BLOODIED = 1,
  DISTANCE = 2,
  BALANCE = 3,
  STANDING = 4,
  MOTION = 5,
}
export const SORT_ORDER = {
  [AxisEnum.DAMAGE]: SortAxisEnum.DAMAGE,

  [AxisEnum.BLOODIED]: SortAxisEnum.FRESH_OR_BLOODIED,
  [AxisEnum.FRESH]: SortAxisEnum.FRESH_OR_BLOODIED,

  [AxisEnum.DISTANCE]: SortAxisEnum.DISTANCE,
  [AxisEnum.GRAPPLED]: SortAxisEnum.DISTANCE,
  [AxisEnum.CLOSE]: SortAxisEnum.DISTANCE,
  [AxisEnum.FAR]: SortAxisEnum.DISTANCE,
  [AxisEnum.FURTHER]: SortAxisEnum.DISTANCE,
  [AxisEnum.CLOSER]: SortAxisEnum.DISTANCE,
  [AxisEnum.NOT_GRAPPLED]: SortAxisEnum.DISTANCE,
  [AxisEnum.NOT_CLOSE]: SortAxisEnum.DISTANCE,
  [AxisEnum.NOT_FAR]: SortAxisEnum.DISTANCE,

  [AxisEnum.POISE]: SortAxisEnum.BALANCE,
  [AxisEnum.LOSE_POISE]: SortAxisEnum.BALANCE,
  [AxisEnum.UNBALANCED]: SortAxisEnum.BALANCE,
  [AxisEnum.BALANCED]: SortAxisEnum.BALANCE,
  [AxisEnum.ANTICIPATING]: SortAxisEnum.BALANCE,
  [AxisEnum.NOT_ANTICIPATING]: SortAxisEnum.BALANCE,

  [AxisEnum.STANCE]: SortAxisEnum.STANDING,
  [AxisEnum.STANDING]: SortAxisEnum.STANDING,
  [AxisEnum.PRONE]: SortAxisEnum.STANDING,

  [AxisEnum.MOTION]: SortAxisEnum.MOTION,
  [AxisEnum.STILL]: SortAxisEnum.MOTION,
  [AxisEnum.MOVING]: SortAxisEnum.MOTION,

  [AxisEnum.BLOCK]: 10,
  [AxisEnum.PARRY]: 11,
  [AxisEnum.CLUTCH]: 12,
  [AxisEnum.FLUID]: 13,
  [AxisEnum.RIGID]: 13,

  [AxisEnum.REFLEX]: 20,
  [AxisEnum.CRIPPLE]: 21,
  [MechanicEnum.ENHANCE]: 22,
  [MechanicEnum.PREDICT]: 23,

  [MechanicEnum.PICK_ONE]: 30,

  [MechanicEnum.FOCUS]: 31,
  [MechanicEnum.TELEGRAPH]: 32,
};
/*
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
}*/
/*
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

*/
