"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stateInterface_1 = require("../../interfaces/stateInterface");
const card_1 = require("../../../shared/card");
const axis_1 = require("./axis");
const block_1 = require("../mechanics/block");
const buff_1 = require("../mechanics/buff");
const cripple_1 = require("../mechanics/cripple");
const focus_1 = require("../mechanics/focus");
const predict_1 = require("../mechanics/predict");
const reflex_1 = require("../mechanics/reflex");
const telegraph_1 = require("../mechanics/telegraph");
const enhance_1 = require("../mechanics/enhance");
const setup_1 = require("../mechanics/setup");
exports.reduceMechanics = (readiedMechanics, state) => {
    readiedMechanics.forEach(({ mechanic: mech, card, isEventOnly }) => {
        const reducer = mechanicRouter[mech.mechanic];
        if (isEventOnly)
            return;
        if (reducer !== undefined) {
            reducer(mech, card, card.player, card.opponent, state);
        }
        else {
            console.error("There is no reducer for this mechanic.", mech, card);
        }
    });
};
exports.reduceStateChangeReaEff = (reaEff, state) => {
    const whoToCheck = reaEff.happensTo.map((value, i) => value === stateInterface_1.HappensEnum.HAPPENS ? i : null)
        .filter((value) => value !== null);
    reduceStateChange(reaEff.mechanic, reaEff.card, reaEff.card.player, reaEff.card.opponent, state, whoToCheck);
};
const reduceStateChange = (mechanic, card, player, opponent, state, appliesTo) => {
    const applyGlobal = axis_1.globalAxis[mechanic.axis];
    if (appliesTo.length === 0) {
        return;
    }
    if (applyGlobal !== undefined) {
        applyGlobal(state);
    }
    let amount;
    if (mechanic.amount !== undefined && mechanic.amount !== null) {
        amount = Number(mechanic.amount);
    }
    else {
        amount = null;
    }
    const applyPlayerState = axis_1.playerAxis[mechanic.axis];
    if (applyPlayerState !== undefined && (amount === undefined || !isNaN(amount))) {
        applyPlayerState(appliesTo, amount, state);
    }
};
const mechanicRouter = {
    [card_1.MechanicEnum.BLOCK]: block_1.reduceBlock,
    [card_1.MechanicEnum.BUFF]: buff_1.reduceBuff,
    [card_1.MechanicEnum.CRIPPLE]: cripple_1.reduceCripple,
    [card_1.MechanicEnum.FOCUS]: focus_1.reduceFocus,
    [card_1.MechanicEnum.PREDICT]: predict_1.reducePredict,
    [card_1.MechanicEnum.REFLEX]: reflex_1.reduceReflex,
    [card_1.MechanicEnum.TELEGRAPH]: telegraph_1.reduceTelegraph,
    [card_1.MechanicEnum.ENHANCE]: enhance_1.reduceEnhance,
    [card_1.MechanicEnum.SETUP]: setup_1.reduceSetup,
};
