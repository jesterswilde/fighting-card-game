"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../util");
const card_1 = require("../../../shared/card");
/*
    Clutch increases the priority of a card.
    Clutch is always the child of some other mechanic (Like optional, forceful or choose)
    Clutch is removed from a card when that card is culled from the queue
*/
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
