"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = require("../../../shared/card");
const util_1 = require("../../util");
/*
    Block N mitigates N damge done NEXT turn.
    Parry N mitigates N damage done this turn.
    At the start of each turn, block from the previous turn is converted to parry.
*/
exports.collectBlock = (state) => {
    const blockArrs = [];
    state.readiedEffects = state.readiedEffects.map((playerEff, index) => {
        const [hasBlock, unused] = util_1.splitArray(playerEff, ({ effect }) => effect.axis === card_1.AxisEnum.BLOCK);
        blockArrs[index] = hasBlock;
        return unused;
    });
    const block = blockArrs.map((arr) => {
        return arr.reduce((total, { effect: { amount = 0 } }) => total + Number(amount), 0);
    });
    block.forEach((amount, index) => state.block[index] += amount);
};
exports.convertBlockToParry = (state) => {
    state.block = state.block.map((block, index) => {
        state.parry[index] += block;
        return 0;
    });
};
