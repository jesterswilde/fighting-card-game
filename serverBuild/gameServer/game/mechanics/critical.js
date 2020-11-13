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
/**Actually marks on card whether a critical's requirements are met */
exports.markCritical = (state) => {
    state.hands.forEach((hand) => {
        hand.forEach(({ player, mechanics }) => {
            const opponent = util_1.getOpponent(player);
            mechanics.filter(mech => mech.mechanic === card_1.MechanicEnum.CRITICAL)
                .forEach((crit) => {
                crit.canPlay = exports.canUseCritical(crit, player, opponent, state);
            });
        });
    });
};
/**Puts valid critical effets into the 'activeCriticals' property of hand cards */
exports.addCriticalToHandCard = (card, handCard) => {
    card.mechanics.filter(mech => mech.mechanic == card_1.MechanicEnum.CRITICAL)
        .forEach(crit => {
        if (crit.canPlay) {
            handCard.activeCriticals = handCard.activeCriticals || [];
            handCard.activeCriticals.push(crit.index);
        }
    });
};
exports.getEffectsFromCrits = (crits) => {
    const effects = [];
    crits.filter(crit => crit.canPlay)
        .forEach(crit => effects.push(...crit.effects));
    return effects;
};
