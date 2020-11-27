"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applySimpleMech = void 0;
const card_1 = require("../../../shared/card");
const util_1 = require("../../util");
const buff_1 = require("../mechanics/buff");
const cripple_1 = require("../mechanics/cripple");
const reflex_1 = require("../mechanics/reflex");
const rigidFluid_1 = require("../mechanics/rigidFluid");
const isSimpleMech = (reaEff) => effectRouter.hasOwnProperty(reaEff.effect.axis);
exports.applySimpleMech = (state) => {
    state.readiedEffects = state.readiedEffects.map(effs => {
        const [simple, unused] = util_1.splitArray(effs, eff => isSimpleMech(eff));
        simple.forEach(simple => effectRouter[simple.effect.axis](simple.effect, simple.card, simple.card.player, simple.card.opponent, state));
        return unused;
    });
};
const effectRouter = {
    [card_1.AxisEnum.BUFF]: buff_1.handleBuff,
    [card_1.AxisEnum.CRIPPLE]: cripple_1.addCrippleCardToOpponentsDeck,
    [card_1.AxisEnum.REFLEX]: reflex_1.markShouldReflexOnQueueCard,
    [card_1.AxisEnum.FLUID]: rigidFluid_1.handleFluid,
    [card_1.AxisEnum.RIGID]: rigidFluid_1.handleRigid
};
