"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = require("../../../shared/card");
const util_1 = require("../../util");
/*
    Block N mitigates N damge done NEXT turn.
    Parry N mitigates N damage done this turn.
    At the start of each turn, block from the previous turn is converted to parry.
*/
exports.reduceBlock = (mechanic, card, player, opponent, state) => {
    const { block } = state;
    block[player] = block[player] || 0;
    if (typeof mechanic.amount === 'number') {
        block[player] += mechanic.amount;
    }
    console.log('block was played', state.block);
};
exports.collectBlock = (state) => {
    const blockArrs = [];
    state.readiedEffects = state.readiedEffects.map((playerEff, index) => {
        const [hasBlock, unused] = util_1.splitArray(playerEff, (reaEff) => reaEff.mechanic.mechanic === card_1.MechanicEnum.BLOCK);
        blockArrs[index] = hasBlock;
        return unused;
    });
    const block = blockArrs.map((arr) => {
        return arr.reduce((total, { mechanic: { amount = 0 } }) => total + Number(amount), 0);
    });
    block.forEach((amount, index) => state.block[index] += amount);
};
exports.convertBlockToParry = (state) => {
    state.block = state.block.map((block, index) => {
        state.parry[index] += block;
        return 0;
    });
};
