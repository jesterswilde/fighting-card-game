"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requirements_1 = require("../playCards/requirements");
const readiedEffects_1 = require("../readiedEffects");
const errors_1 = require("../../errors");
const queue_1 = require("../queue");
/*
    Focus happens at the end of every turn.
    If I card has focus, the requirements of the focus are checked.
    If the requirement is met, the effect happens.
    Active focus lives on the card, it is removed when the card is put into the queue.
*/
exports.putFocusesOntoQueueCard = (mechanic, card, player, opponent, state) => {
    card.focuses = card.focuses || [];
    card.focuses.push(mechanic);
};
exports.checkFocus = (state) => {
    if (state.checkedFocus) {
        return;
    }
    state.checkedFocus = true;
    let modifiedState = false;
    const readied = [];
    queue_1.forEachCardInQueue(state, (card) => {
        if (card.focuses) {
            const focusEffects = readyFocusEffects(card, state);
            readied.push(...focusEffects);
        }
    });
    if (readied.length > 0) {
        readied.forEach(reaEff => state.readiedEffects[reaEff.card.player].push(reaEff));
        modifiedState = true;
        throw errors_1.ControlEnum.NEW_EFFECTS;
    }
};
const readyFocusEffects = (card, state) => {
    return card.focuses
        .filter((mech) => requirements_1.mechReqsMet(mech, card.opponent, card.player, state))
        .reduce((readied, mech) => {
        const readiedEff = readiedEffects_1.readyEffects(mech.effects, card, state);
        readied.push(...readiedEff);
        return readied;
    }, []);
};
