"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectParry = void 0;
const util_1 = require("../../util");
const card_1 = require("../../../shared/card");
/*
    reduces incoming damage by N amount
*/
exports.collectParry = (state) => {
    const parryArrs = [];
    state.readiedEffects = state.readiedEffects.map((readiedEffect, playerIndex) => {
        const [parryEffects, unused] = util_1.splitArray(readiedEffect, (reaEff) => reaEff.effect.axis === card_1.AxisEnum.PARRY);
        parryArrs[playerIndex] = parryEffects;
        return unused;
    });
    const parry = parryArrs.map((arr) => {
        return arr.reduce((total, { effect: { amount = 0 } }) => total + Number(amount), 0);
    });
    parry.forEach((amount, index) => state.parry[index] += amount);
};
