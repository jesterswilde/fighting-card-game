"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = require("../../../shared/card");
const util_1 = require("../../util");
exports.applyClutch = (state) => {
    state.readiedEffects = state.readiedEffects.map((playerReaffs, player) => {
        const [clutchArr, unusedArr] = util_1.splitArray(playerReaffs, ({ mechanic }) => mechanic.mechanic === card_1.MechanicEnum.CLUTCH);
        clutchArr.forEach(({ mechanic, card }) => {
            const clutch = card.clutch ? card.clutch : 0;
            card.clutch = clutch + Number(mechanic.amount);
        });
        return unusedArr;
    });
};
exports.calculatePriority = (card, player, state) => {
    const clutch = card.clutch || 0;
    const priority = card.priority || 0;
    const setup = state.setup[player] || 0;
    return clutch + priority + setup;
};
