import { AxisEnum, MechanicEnum, Card, Requirement, Effect } from "./card";

export const getSortOrder = (mechanic: MechanicEnum | AxisEnum) => {
  const order = SORT_ORDER[mechanic];
  if (order !== undefined) {
    return order;
  }
  return 100;
};

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

export const sortCard = (card: Card) => {
  if (card.priority === undefined) {
    card.priority = 5;
  }
  sortRequirements(card.requirements);
  sortEffects(card.effects);
  for (const mechanic of card.mechanics || []) {
    sortRequirements(mechanic.requirements || []);
    sortEffects(mechanic.effects || []);
    for (const choice of mechanic.choices || []) {
      sortEffects(choice);
    }
  }
};

const sortRequirements = (reqs: Requirement[]) => {
  reqs.sort((a, b) => getSortOrder(a.axis) - getSortOrder(b.axis));
};

const sortEffects = (effects: Effect[]) => {
  effects.sort((a, b) => getSortOrder(a.axis) - getSortOrder(b.axis));
  for (const effect of effects) {
    if (
      (effect.axis === AxisEnum.PRONE || effect.axis === AxisEnum.MOVING) &&
      effect.amount === undefined
    ) {
      effect.amount = 2;
    }
  }
};
