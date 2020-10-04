"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
    Buff permanently increases the damage of a card by N amount on every successive play of that card.
*/
exports.buffCard = (effect, card, player, opponent, state) => {
    card.buffed = card.buffed || 0;
    card.buffed += effect.amount;
};
