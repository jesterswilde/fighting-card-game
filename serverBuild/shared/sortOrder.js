"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = require("./card");
exports.getAxisGroup = (mechanic) => {
    const order = exports.SORT_ORDER[mechanic];
    if (order !== undefined) {
        return order;
    }
    return 100;
};
var SortAxisEnum;
(function (SortAxisEnum) {
    SortAxisEnum[SortAxisEnum["DAMAGE"] = 0] = "DAMAGE";
    SortAxisEnum[SortAxisEnum["FRESH_OR_BLOODIED"] = 1] = "FRESH_OR_BLOODIED";
    SortAxisEnum[SortAxisEnum["DISTANCE"] = 2] = "DISTANCE";
    SortAxisEnum[SortAxisEnum["BALANCE"] = 3] = "BALANCE";
    SortAxisEnum[SortAxisEnum["STANDING"] = 4] = "STANDING";
    SortAxisEnum[SortAxisEnum["MOTION"] = 5] = "MOTION";
})(SortAxisEnum = exports.SortAxisEnum || (exports.SortAxisEnum = {}));
exports.SORT_ORDER = {
    [card_1.AxisEnum.DAMAGE]: SortAxisEnum.DAMAGE,
    [card_1.AxisEnum.BLOODIED]: SortAxisEnum.FRESH_OR_BLOODIED,
    [card_1.AxisEnum.FRESH]: SortAxisEnum.FRESH_OR_BLOODIED,
    [card_1.AxisEnum.DISTANCE]: SortAxisEnum.DISTANCE,
    [card_1.AxisEnum.GRAPPLED]: SortAxisEnum.DISTANCE,
    [card_1.AxisEnum.CLOSE]: SortAxisEnum.DISTANCE,
    [card_1.AxisEnum.FAR]: SortAxisEnum.DISTANCE,
    [card_1.AxisEnum.FURTHER]: SortAxisEnum.DISTANCE,
    [card_1.AxisEnum.CLOSER]: SortAxisEnum.DISTANCE,
    [card_1.AxisEnum.NOT_GRAPPLED]: SortAxisEnum.DISTANCE,
    [card_1.AxisEnum.NOT_CLOSE]: SortAxisEnum.DISTANCE,
    [card_1.AxisEnum.NOT_FAR]: SortAxisEnum.DISTANCE,
    [card_1.AxisEnum.POISE]: SortAxisEnum.BALANCE,
    [card_1.AxisEnum.LOSE_POISE]: SortAxisEnum.BALANCE,
    [card_1.AxisEnum.UNBALANCED]: SortAxisEnum.BALANCE,
    [card_1.AxisEnum.BALANCED]: SortAxisEnum.BALANCE,
    [card_1.AxisEnum.ANTICIPATING]: SortAxisEnum.BALANCE,
    [card_1.AxisEnum.NOT_ANTICIPATING]: SortAxisEnum.BALANCE,
    [card_1.AxisEnum.STANCE]: SortAxisEnum.STANDING,
    [card_1.AxisEnum.STANDING]: SortAxisEnum.STANDING,
    [card_1.AxisEnum.PRONE]: SortAxisEnum.STANDING,
    [card_1.AxisEnum.MOTION]: SortAxisEnum.MOTION,
    [card_1.AxisEnum.STILL]: SortAxisEnum.MOTION,
    [card_1.AxisEnum.MOVING]: SortAxisEnum.MOTION,
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
