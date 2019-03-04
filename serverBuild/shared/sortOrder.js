"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = require("./card");
exports.getSortOrder = (mechanic) => {
    const order = exports.SORT_ORDER[mechanic];
    return order || 100;
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
    [card_1.MechanicEnum.BLOCK]: 6,
    [card_1.MechanicEnum.REFLEX]: 7,
    [card_1.MechanicEnum.CRIPPLE]: 8,
    [card_1.MechanicEnum.ENHANCE]: 8,
    [card_1.MechanicEnum.PREDICT]: 9,
    [card_1.MechanicEnum.PREDICT]: 9,
    [card_1.MechanicEnum.LOCK]: 9,
    [card_1.MechanicEnum.PICK_ONE]: 10,
    [card_1.MechanicEnum.FOCUS]: 11,
    [card_1.MechanicEnum.TELEGRAPH]: 11,
};
