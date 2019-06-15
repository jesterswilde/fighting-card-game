"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = require("../../../shared/card");
/*
    Buff permanently increases the damage of a card by N amount on every successive play of that card.
*/
exports.reduceBuff = (mechanic, card, player, opponent, state) => {
    const effect = card.effects.find(({ mechanic: mechEnum, axis, player, amount }) => {
        return mechanic.axis === axis && player === mechanic.player && mechEnum !== card_1.MechanicEnum.BUFF;
    });
    if (effect !== undefined && typeof effect.amount === 'number' && typeof mechanic.amount === 'number') {
        effect.amount += mechanic.amount;
    }
    else {
        card.effects.push({ axis: mechanic.axis, amount: mechanic.amount, player: mechanic.player });
    }
};
