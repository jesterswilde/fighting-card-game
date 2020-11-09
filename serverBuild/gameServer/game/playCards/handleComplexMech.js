"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = require("../../../shared/card");
const focus_1 = require("../mechanics/focus");
const predict_1 = require("../mechanics/predict");
const telegraph_1 = require("../mechanics/telegraph");
const enhance_1 = require("../mechanics/enhance");
/**Calls the handler for each complex mechanic */
exports.applyComplexMech = (state) => {
    state.readiedMechanics.forEach((reaMech) => {
        exports.handleReadiedComplexMech(reaMech, state);
    });
};
exports.handleReadiedComplexMech = (readiedMechanics, state) => {
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
//Cards that don't require player choice end up here. Forceful and Pick one get handled earlier
const mechanicRouter = {
    [card_1.MechanicEnum.FOCUS]: focus_1.putFocusesOntoQueueCard,
    [card_1.MechanicEnum.PREDICT]: predict_1.movePredictionsToPending,
    [card_1.MechanicEnum.TELEGRAPH]: telegraph_1.putTelegraphsOntoQueueCard,
    [card_1.MechanicEnum.ENHANCE]: enhance_1.handleEnhancementMechanic,
};
