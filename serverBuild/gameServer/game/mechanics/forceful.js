"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerChoosesForce = void 0;
const util_1 = require("../../util");
const card_1 = require("../../../shared/card");
const readiedEffects_1 = require("../readiedEffects");
const events_1 = require("../events");
/*
    Give up N poise, to gain an effect.
    Forceful is it's own choice, but only shows up if you can pay it.
*/
exports.playerChoosesForce = async (player, state) => {
    const [valid, unused] = getValidAndUnusedForceful(state, player);
    const newEffs = await playerChoosesFromValid(valid, player, state);
    if (newEffs.length > 0) {
        state.readiedEffects[player].push(...newEffs);
        events_1.addDisplayEvent("Forceful", player, state, true);
    }
    state.readiedMechanics[player] = unused;
};
const getValidAndUnusedForceful = (state, player) => {
    const { readiedMechanics = [] } = state;
    let readiedMechs = readiedMechanics[player] || [];
    let [forcefulMechs, unused] = util_1.splitArray(readiedMechs, ({ mechanic }) => mechanic.mechanic === card_1.MechanicEnum.FORCEFUL);
    const validForcefulArr = forcefulMechs.filter(({ mechanic }) => state.playerStates[player].poise >= mechanic.amount);
    return [validForcefulArr, unused];
};
const playerChoosesFromValid = async (valid, player, state) => {
    let newEffs = [];
    for (let i = 0; i < valid.length; i++) {
        const { card: { name: cardName }, mechanic, card, } = valid[i];
        const choseToPlay = await state.agents[player].getUsedForceful({ cardName, index: mechanic.index });
        if (choseToPlay) {
            state.playerStates[player].poise -= mechanic.amount;
            newEffs.push(...readiedEffects_1.makeReadyEffects(mechanic.effects, card));
        }
    }
    return newEffs;
};
