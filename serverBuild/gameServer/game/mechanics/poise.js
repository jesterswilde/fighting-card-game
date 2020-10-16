"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stateInterface_1 = require("../../interfaces/stateInterface");
const gameSettings_1 = require("../../gameSettings");
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
