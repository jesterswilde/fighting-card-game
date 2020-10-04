"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = require("./card");
exports.getSortOrder = (mechanic) => {
    const order = exports.SORT_ORDER[mechanic];
    if (order !== undefined) {
        return order;
    }
    return 100;
};
exports.SORT_ORDER = {
    [card_1.AxisEnum.DAMAGE]: 0,
    [card_1.AxisEnum.BLOODIED]: 1,
    [card_1.AxisEnum.FRESH]: 1,
    [card_1.AxisEnum.DISTANCE]: 2,
    [card_1.AxisEnum.GRAPPLED]: 2,
    [card_1.AxisEnum.CLOSE]: 2,
    [card_1.AxisEnum.FAR]: 2,
    [card_1.AxisEnum.FURTHER]: 2,
    [card_1.AxisEnum.CLOSER]: 2,
    [card_1.AxisEnum.NOT_GRAPPLED]: 2,
    [card_1.AxisEnum.NOT_CLOSE]: 2,
    [card_1.AxisEnum.NOT_FAR]: 2,
    [card_1.AxisEnum.POISE]: 3,
    [card_1.AxisEnum.LOSE_POISE]: 3,
    [card_1.AxisEnum.UNBALANCED]: 3,
    [card_1.AxisEnum.BALANCED]: 3,
    [card_1.AxisEnum.ANTICIPATING]: 3,
    [card_1.AxisEnum.NOT_ANTICIPATING]: 3,
    [card_1.AxisEnum.STANCE]: 4,
    [card_1.AxisEnum.STANDING]: 4,
    [card_1.AxisEnum.PRONE]: 4,
    [card_1.AxisEnum.MOTION]: 5,
    [card_1.AxisEnum.STILL]: 5,
    [card_1.AxisEnum.MOVING]: 5,
    [card_1.AxisEnum.BLOCK]: 10,
    [card_1.AxisEnum.PARRY]: 11,
    [card_1.AxisEnum.CLUTCH]: 12,
    [card_1.AxisEnum.FLUID]: 13,
    [card_1.AxisEnum.RIGID]: 13,
    [card_1.AxisEnum.REFLEX]: 20,
    [card_1.AxisEnum.CRIPPLE]: 21,
    [card_1.MechanicEnum.ENHANCE]: 22,
    [card_1.MechanicEnum.PREDICT]: 23,
    [card_1.MechanicEnum.PICK_ONE]: 30,
    [card_1.MechanicEnum.FOCUS]: 31,
    [card_1.MechanicEnum.TELEGRAPH]: 32,
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
