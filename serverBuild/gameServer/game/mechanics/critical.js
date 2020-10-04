"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = require("../../../shared/card");
const requirements_1 = require("../playCards/requirements");
const util_1 = require("../../util");
//Extra effects if certain (non-filtering) conditions are met
exports.canUseCritical = (critical, player, opponent, state) => {
    return critical.requirements.every((req) => {
        return requirements_1.meetsRequirements(req, state, player, opponent);
    });
};
exports.markCritical = (state) => {
    state.hands.forEach((hand) => {
        hand.forEach(({ player, mechanics }) => {
            const opponent = util_1.getOpponent(player);
            mechanics.filter(mech => mech.mechanic === card_1.MechanicEnum.CRITICAL)
                .forEach((opt) => {
                opt.canPlay = exports.canUseCritical(opt, player, opponent, state);
            });
        });
    });
};
