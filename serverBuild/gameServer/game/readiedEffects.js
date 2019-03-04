"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stateInterface_1 = require("../interfaces/stateInterface");
const card_1 = require("../../shared/card");
const util_1 = require("../util");
const lodash_1 = require("lodash");
exports.mechanicsToReadiedEffects = (mechanics = [], card, state) => {
    return mechanics.map((mech) => exports.mechanicToReadiedEffect(mech, card, state));
};
exports.mechanicToReadiedEffect = (mechanic, card, state) => {
    const happensTo = lodash_1.fill([], stateInterface_1.HappensEnum.NEVER_AFFECTED, 0, state.numPlayers);
    switch (mechanic.player) {
        case card_1.PlayerEnum.PLAYER:
            happensTo[card.player] = stateInterface_1.HappensEnum.HAPPENS;
            break;
        case card_1.PlayerEnum.OPPONENT:
            happensTo[card.opponent] = stateInterface_1.HappensEnum.HAPPENS;
            break;
        case card_1.PlayerEnum.BOTH:
            happensTo[card.player] = stateInterface_1.HappensEnum.HAPPENS;
            happensTo[card.opponent] = stateInterface_1.HappensEnum.HAPPENS;
    }
    return { mechanic: util_1.deepCopy(mechanic), card, happensTo };
};
exports.addReadiedToState = (readiedArr, state) => {
    readiedArr.forEach((readied) => {
        const player = readied.card.player;
        if (typeof player !== 'number') {
            throw new Error('card lacks player');
        }
        state.readiedEffects[player].push(readied);
    });
};
