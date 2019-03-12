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
    [card_1.MechanicEnum.BLOCK]: 10,
    [card_1.MechanicEnum.PARRY]: 11,
    [card_1.MechanicEnum.CLUTCH]: 12,
    [card_1.MechanicEnum.REFLEX]: 20,
    [card_1.MechanicEnum.CRIPPLE]: 21,
    [card_1.MechanicEnum.ENHANCE]: 22,
    [card_1.MechanicEnum.PREDICT]: 23,
    [card_1.MechanicEnum.LOCK]: 24,
    [card_1.MechanicEnum.PICK_ONE]: 30,
    [card_1.MechanicEnum.FOCUS]: 31,
    [card_1.MechanicEnum.TELEGRAPH]: 32,
};
exports.sortCard = (card) => {
    if (card.priority === undefined) {
        card.priority = 5;
    }
    sortRequirements(card.requirements);
    sortEffects(card.effects);
    card.optional.forEach((opt) => {
        sortRequirements(opt.requirements);
        sortEffects(opt.effects);
    });
};
const sortRequirements = (reqs) => {
    reqs.sort((a, b) => exports.getSortOrder(a.axis) - exports.getSortOrder(b.axis));
};
const sortEffects = (effs) => {
    effs.sort((a, b) => {
        let aVal, bVal;
        if (a.mechanic !== undefined) {
            aVal = exports.getSortOrder(a.mechanic);
        }
        else {
            aVal = exports.getSortOrder(a.axis);
        }
        if (b.mechanic !== undefined) {
            bVal = exports.getSortOrder(b.mechanic);
        }
        else {
            bVal = exports.getSortOrder(b.axis);
        }
        return aVal - bVal;
    });
    effs.forEach((eff) => {
        if ((eff.axis === card_1.AxisEnum.PRONE || eff.axis === card_1.AxisEnum.MOVING) && eff.amount === undefined) {
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
            });
        }
    });
};
