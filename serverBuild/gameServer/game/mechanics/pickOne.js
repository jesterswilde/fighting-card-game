"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerPicksOne = void 0;
const card_1 = require("../../../shared/card");
const readiedEffects_1 = require("../readiedEffects");
const util_1 = require("../../util");
const events_1 = require("../events");
/*
    A player is given a few choices by a card, and get to pick only one.
*/
exports.playerPicksOne = async (player, state) => {
    const { agents } = state;
    const [pickedOne, unused] = util_1.splitArray(state.readiedMechanics[player], (reaMech => reaMech.mechanic.mechanic === card_1.MechanicEnum.PICK_ONE));
    const pickedEffects = [];
    state.readiedMechanics[player] = unused;
    for (let i = 0; i < pickedOne.length; i++) {
        const { mechanic, card, } = pickedOne[i];
        const choice = await agents[player].getPickOneChoice({ cardName: card.name, index: mechanic.index });
        const picked = mechanic.choices[choice];
        pickedEffects.push(...picked);
        state.readiedEffects[player] = [...state.readiedEffects[player], ...readiedEffects_1.makeReadyEffects(pickedEffects, card)];
        events_1.addDisplayEvent("Picked One", player, state, true);
    }
};
