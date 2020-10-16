"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stateInterface_1 = require("../interfaces/stateInterface");
const card_1 = require("../../shared/card");
const util_1 = require("../util");
exports.readyMechanics = (mechanics, card) => {
    return mechanics.map((mechanic) => ({ mechanic, card }));
};
exports.readyMechanic = (mechanic, card) => {
    return { mechanic, card };
};
exports.readyEffects = (effects = [], card, state) => {
    return effects.map((eff) => exports.readyEffect(eff, card, state));
};
exports.readyEffect = (effect, card, state) => {
    const happensTo = [];
    happensTo[card.player] =
        effect.player === card_1.PlayerEnum.OPPONENT
            ? stateInterface_1.HappensEnum.NEVER_AFFECTED
            : stateInterface_1.HappensEnum.HAPPENS;
    happensTo[card.opponent] =
        effect.player === card_1.PlayerEnum.PLAYER
            ? stateInterface_1.HappensEnum.NEVER_AFFECTED
            : stateInterface_1.HappensEnum.HAPPENS;
    return { effect: util_1.deepCopy(effect), card, happensTo };
};
/*
export const addReadiedToState = (readiedArr: ReadiedEffect[], state: GameState) => {
    readiedArr.forEach((readied) => {
        const player = readied.card.player
        if (typeof player !== 'number') {
            throw new Error('card lacks player');
        }
        state.readiedEffects[player].push(readied);
    })
}
*/
