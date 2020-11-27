"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFluid = exports.handleRigid = void 0;
const card_1 = require("../../../shared/card");
exports.handleRigid = (effect, card, player, opponent, state) => {
    if (effect.player === card_1.PlayerEnum.PLAYER || effect.player === card_1.PlayerEnum.BOTH) {
        state.nextHandSizeMod[player] = state.nextHandSizeMod[player] || 0;
        state.nextHandSizeMod[player] -= effect.amount;
    }
    if (effect.player === card_1.PlayerEnum.OPPONENT || effect.player === card_1.PlayerEnum.BOTH) {
        state.nextHandSizeMod[opponent] = state.nextHandSizeMod[opponent] || 0;
        state.nextHandSizeMod[opponent] -= effect.amount;
    }
};
exports.handleFluid = (effect, card, player, opponent, state) => {
    if (effect.player === card_1.PlayerEnum.PLAYER || effect.player === card_1.PlayerEnum.BOTH) {
        state.nextHandSizeMod[player] = state.nextHandSizeMod[player] || 0;
        state.nextHandSizeMod[player] += effect.amount;
    }
    if (effect.player === card_1.PlayerEnum.OPPONENT || effect.player === card_1.PlayerEnum.BOTH) {
        state.nextHandSizeMod[opponent] = state.nextHandSizeMod[opponent] || 0;
        state.nextHandSizeMod[opponent] += effect.amount;
    }
};
