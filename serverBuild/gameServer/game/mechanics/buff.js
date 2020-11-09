"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = require("../../../shared/card");
const util_1 = require("../../util");
/*
    Buff permanently increases the damage of a card by N amount on every successive play of that card.
*/
exports.applyBuff = (state) => {
    console.log("applying buff");
    state.readiedEffects = state.readiedEffects.map((allEffs) => {
        const [buffEff, unusedEffs] = util_1.splitArray(allEffs, ({ effect }) => effect.axis == card_1.AxisEnum.BUFF);
        buffEff.forEach(eff => exports.handleBuff(eff.effect, eff.card));
        return unusedEffs;
    });
};
exports.handleBuff = (effect, card) => {
    console.log("Hanlde buff called: ", card, effect);
    card.buffed = card.buffed || 0;
    card.buffed += effect.amount;
};
/**
 * Returns effects for use in card display or effects
 */
exports.makeEffectsFromBuff = (card) => {
    if (!card.buffed)
        return [];
    return [{
            player: card_1.PlayerEnum.OPPONENT,
            axis: card_1.AxisEnum.DAMAGE,
            amount: card.buffed
        }];
};
