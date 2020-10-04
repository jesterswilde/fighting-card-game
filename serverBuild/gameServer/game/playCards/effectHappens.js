"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stateInterface_1 = require("../../interfaces/stateInterface");
const card_1 = require("../../../shared/card");
const axis_1 = require("./axis");
const buff_1 = require("../mechanics/buff");
const cripple_1 = require("../mechanics/cripple");
const focus_1 = require("../mechanics/focus");
const predict_1 = require("../mechanics/predict");
const reflex_1 = require("../mechanics/reflex");
const telegraph_1 = require("../mechanics/telegraph");
const enhance_1 = require("../mechanics/enhance");
const rigidFluid_1 = require("../mechanics/rigidFluid");
exports.handleReadiedMechanics = (readiedMechanics, state) => {
    readiedMechanics.forEach(({ mechanic: mech, card }) => {
        const handler = mechanicRouter[mech.mechanic];
        if (handler !== undefined) {
            handler(mech, card, card.player, card.opponent, state);
        }
        else {
            console.error("There is no reducer for this mechanic.", mech, card);
        }
    });
};
exports.handleReadiedEffects = (reaEff, state) => {
    const whoToCheck = reaEff.happensTo.map((value, i) => value === stateInterface_1.HappensEnum.HAPPENS ? i : null)
        .filter((value) => value !== null);
    handleStateChange(reaEff.effect, reaEff.card, reaEff.card.player, reaEff.card.opponent, state, whoToCheck);
};
const handleStateChange = (effect, card, player, opponent, state, appliesTo) => {
    const applyGlobal = axis_1.globalAxis[effect.axis];
    if (appliesTo.length === 0) {
        return;
    }
    if (applyGlobal !== undefined) {
        applyGlobal(state);
    }
    let amount;
    if (effect.amount !== undefined && effect.amount !== null) {
        amount = Number(effect.amount);
    }
    else {
        amount = null;
    }
    const applyPlayerState = axis_1.playerAxis[effect.axis];
    if (applyPlayerState !== undefined && (amount === undefined || !isNaN(amount))) {
        applyPlayerState(appliesTo, amount, state);
    }
};
//Cards that don't require player choice end up here. Forceful and Pick one get handled earlier
const mechanicRouter = {
    [card_1.MechanicEnum.FOCUS]: focus_1.putFocusesOntoQueueCard,
    [card_1.MechanicEnum.PREDICT]: predict_1.movePredictionsToPending,
    [card_1.MechanicEnum.TELEGRAPH]: telegraph_1.putTelegraphsOntoQueueCard,
    [card_1.MechanicEnum.ENHANCE]: enhance_1.handleEnhancementMechanic,
};
const effectRouter = {
    [card_1.AxisEnum.BUFF]: buff_1.buffCard,
    [card_1.AxisEnum.CRIPPLE]: cripple_1.addCrippleCardToOpponentsDeck,
    [card_1.AxisEnum.REFLEX]: reflex_1.markShouldReflexOnQueueCard,
    [card_1.AxisEnum.FLUID]: rigidFluid_1.handleFluid,
    [card_1.AxisEnum.RIGID]: rigidFluid_1.handleRigid
};
