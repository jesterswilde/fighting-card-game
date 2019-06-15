"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../util");
const card_1 = require("../../../shared/card");
/*
    reduces incoming damage by N amount
*/
exports.collectParry = (state) => {
    const parryArrs = [];
    state.readiedEffects = state.readiedEffects.map((playerEff, index) => {
        const [hasParry, unused] = util_1.splitArray(playerEff, (reaEff) => reaEff.mechanic.mechanic === card_1.MechanicEnum.PARRY);
        parryArrs[index] = hasParry;
        return unused;
    });
    const parry = parryArrs.map((arr) => {
        return arr.reduce((total, { mechanic: { amount = 0 } }) => total + Number(amount), 0);
    });
    parry.forEach((amount, index) => state.parry[index] += amount);
};
