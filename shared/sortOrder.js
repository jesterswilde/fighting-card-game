"use strict";
exports.__esModule = true;
var _a;
var card_1 = require("./card");
exports.getSortOrder = function (mechanic) {
    var order = exports.SORT_ORDER[mechanic];
    if (order !== undefined) {
        return order;
    }
    return 100;
};
exports.SORT_ORDER = (_a = {},
    _a[card_1.AxisEnum.DAMAGE] = 0,
    _a[card_1.AxisEnum.BLOODIED] = 1,
    _a[card_1.AxisEnum.DISTANCE] = 2,
    _a[card_1.AxisEnum.GRAPPLED] = 2,
    _a[card_1.AxisEnum.CLOSE] = 2,
    _a[card_1.AxisEnum.FAR] = 2,
    _a[card_1.AxisEnum.FURTHER] = 2,
    _a[card_1.AxisEnum.CLOSER] = 2,
    _a[card_1.AxisEnum.NOT_GRAPPLED] = 2,
    _a[card_1.AxisEnum.NOT_CLOSE] = 2,
    _a[card_1.AxisEnum.NOT_FAR] = 2,
    _a[card_1.AxisEnum.POISE] = 3,
    _a[card_1.AxisEnum.LOSE_POISE] = 3,
    _a[card_1.AxisEnum.UNBALANCED] = 3,
    _a[card_1.AxisEnum.BALANCED] = 3,
    _a[card_1.AxisEnum.ANTICIPATING] = 3,
    _a[card_1.AxisEnum.NOT_ANTICIPATING] = 3,
    _a[card_1.AxisEnum.STANCE] = 4,
    _a[card_1.AxisEnum.STANDING] = 4,
    _a[card_1.AxisEnum.PRONE] = 4,
    _a[card_1.AxisEnum.MOTION] = 5,
    _a[card_1.AxisEnum.STILL] = 5,
    _a[card_1.AxisEnum.MOVING] = 5,
    _a[card_1.MechanicEnum.BLOCK] = 6,
    _a[card_1.MechanicEnum.REFLEX] = 7,
    _a[card_1.MechanicEnum.CRIPPLE] = 8,
    _a[card_1.MechanicEnum.ENHANCE] = 8,
    _a[card_1.MechanicEnum.PREDICT] = 9,
    _a[card_1.MechanicEnum.PREDICT] = 9,
    _a[card_1.MechanicEnum.LOCK] = 9,
    _a[card_1.MechanicEnum.PICK_ONE] = 10,
    _a[card_1.MechanicEnum.FOCUS] = 11,
    _a[card_1.MechanicEnum.TELEGRAPH] = 11,
    _a);
exports.sortCard = function (card) {
    if (card.priority === undefined) {
        card.priority = 5;
    }
    sortRequirements(card.requirements);
    sortEffects(card.effects);
    card.optional.forEach(function (opt) {
        sortRequirements(opt.requirements);
        sortEffects(opt.effects);
    });
};
var sortRequirements = function (reqs) {
    reqs.sort(function (a, b) { return exports.getSortOrder(a.axis) - exports.getSortOrder(b.axis); });
};
var sortEffects = function (effs) {
    effs.sort(function (a, b) {
        var aVal, bVal;
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
    effs.forEach(function (eff) {
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
            eff.choices.forEach(function (choice) {
                sortEffects(choice);
            });
        }
    });
};
