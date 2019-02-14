"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stateInterface_1 = require("../interfaces/stateInterface");
exports.hasPoise = (poiseEnum, player, state) => {
    const { poise } = state.playerStates[player];
    switch (poiseEnum) {
        case stateInterface_1.PoiseEnum.UNBALANCED:
            return poise <= 3;
        case stateInterface_1.PoiseEnum.BALANCED:
            return poise > 3;
        case stateInterface_1.PoiseEnum.ANTICIPATING:
            return poise >= 7;
        default:
            return false;
    }
};
