"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requirements_1 = require("../playCards/requirements");
const readiedEffects_1 = require("../readiedEffects");
const errors_1 = require("../../errors");
const queue_1 = require("../queue");
exports.checkFocus = (state) => {
    if (state.checkedFocus) {
        return;
    }
    state.checkedFocus = true;
    let modifiedState = false;
    const readied = [];
    queue_1.forEachCardInQueue(state, (card) => {
        if (card.focuses) {
            const focusEffects = getReadiedFromCard(card, state);
            readied.push(...focusEffects);
        }
    });
    if (readied.length > 0) {
        readiedEffects_1.addReadiedToState(readied, state);
        modifiedState = true;
        throw errors_1.ControlEnum.NEW_EFFECTS;
    }
};
const getReadiedFromCard = (card, state) => {
    return card.focuses
        .filter((mech) => requirements_1.mechReqsMet(mech, card.opponent, card.player, state))
        .reduce((readied, mech) => {
        const readiedEff = readiedEffects_1.mechanicsToReadiedEffects(mech.mechanicEffects, card, state);
        readied.push(...readiedEff);
        return readied;
    }, []);
};
