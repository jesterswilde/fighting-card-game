"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../util");
const card_1 = require("../../../shared/card");
const effectHappens_1 = require("./effectHappens");
exports.collectBlockAndDamage = (state) => {
    collectParry(state);
    collectBlock(state);
    exports.collectDamage(state);
};
exports.convertBlockToParry = (state) => {
    state.block = state.block.map((block, index) => {
        state.parry[index] += block;
        return 0;
    });
};
const collectParry = (state) => {
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
const collectBlock = (state) => {
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
exports.collectDamage = (state) => {
    state.readiedEffects = state.readiedEffects.map((playerEff, player) => {
        const [damageEffectsPlayer, otherEffects] = util_1.splitArray(playerEff, (reaEff) => reaEff.mechanic.axis === card_1.AxisEnum.DAMAGE);
        state.damageEffects[player] = damageEffectsPlayer;
        return otherEffects;
    });
};
exports.applyCollectedDamage = (state) => {
    state.damageEffects.forEach((playerReaEffs) => {
        playerReaEffs.forEach((reaEff) => console.log('damage', reaEff));
        playerReaEffs.forEach((reaEff) => effectHappens_1.reduceStateChangeReaEff(reaEff, state));
    });
    state.damageEffects = [];
};
