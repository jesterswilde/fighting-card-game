"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyCollectedDamage = exports.collectDamage = exports.collectBlockAndDamage = void 0;
const stateInterface_1 = require("../../interfaces/stateInterface");
const util_1 = require("../../util");
const card_1 = require("../../../shared/card");
const parry_1 = require("../mechanics/parry");
const block_1 = require("../mechanics/block");
const handleStateEffects_1 = require("./handleStateEffects");
exports.collectBlockAndDamage = (state) => {
    parry_1.collectParry(state);
    block_1.collectBlock(state);
    exports.collectDamage(state);
};
exports.collectDamage = (state) => {
    state.readiedEffects = state.readiedEffects.map((playerEff, player) => {
        const [damageEffectsPlayer, otherEffects] = util_1.splitArray(playerEff, ({ effect }) => effect.axis === card_1.AxisEnum.DAMAGE);
        state.readiedDamageEffects[player] =
            state.readiedDamageEffects[player] || [];
        state.readiedDamageEffects[player].push(...damageEffectsPlayer);
        markDamaged(damageEffectsPlayer, state);
        return otherEffects;
    });
};
const markDamaged = (damageEffects, state) => {
    damageEffects.forEach((damageEffect) => {
        damageEffect.happensTo.forEach((happens, player) => {
            if (happens === stateInterface_1.HappensEnum.HAPPENS) {
                state.damaged[player] = true;
            }
        });
    });
};
exports.applyCollectedDamage = (state) => {
    state.readiedDamageEffects.forEach((playerReaEffs) => {
        playerReaEffs.forEach((reaEff) => handleStateEffects_1.handleReadiedEffects(reaEff, state));
    });
    state.readiedDamageEffects = [];
};
