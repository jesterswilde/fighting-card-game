"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stateInterface_1 = require("../../interfaces/stateInterface");
const gameSettings_1 = require("../../gameSettings");
const card_1 = require("../../../shared/card");
const util_1 = require("../../util");
const handleStateEffects_1 = require("../playCards/handleStateEffects");
exports.applyPoise = (state) => {
    state.readiedEffects = state.readiedEffects.map((playerReaEffs, player) => {
        const [poiseArr, unusedArr] = util_1.splitArray(playerReaEffs, ({ effect }) => effect.axis === card_1.AxisEnum.POISE || effect.axis === card_1.AxisEnum.LOSE_POISE);
        poiseArr.forEach((reaEff) => {
            handleStateEffects_1.handleReadiedEffects(reaEff, state);
        });
        return unusedArr;
    });
};
exports.hasPoise = (poiseEnum, player, state) => {
    const { poise } = state.playerStates[player];
    switch (poiseEnum) {
        case stateInterface_1.PoiseEnum.NOT_ANTICIPATING:
            return poise < gameSettings_1.ANTICIPATING_POISE;
        case stateInterface_1.PoiseEnum.UNBALANCED:
            return poise <= gameSettings_1.UNBALANCED_POISE;
        case stateInterface_1.PoiseEnum.BALANCED:
            return poise > gameSettings_1.UNBALANCED_POISE;
        case stateInterface_1.PoiseEnum.ANTICIPATING:
            return poise >= gameSettings_1.ANTICIPATING_POISE;
        default:
            return false;
    }
};
exports.addPoise = (state) => {
    const { playerStates } = state;
    playerStates.forEach((pState) => {
        if (state.turnNumber !== 0 && pState.poise < gameSettings_1.ANTICIPATING_POISE - 1) {
            pState.poise++;
        }
    });
};
