"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const queue_1 = require("../queue");
const requirements_1 = require("../playCards/requirements");
const readiedEffects_1 = require("../readiedEffects");
const errors_1 = require("../../errors");
const util_1 = require("../../util");
exports.checkTelegraph = (state) => {
    let readied = [];
    queue_1.forEachCardInQueue(state, (card, queueIndex) => {
        const canTelegraph = queueIndex !== 0;
        if (canTelegraph && card) {
            const effects = filterTelegraphs(card, state);
            readied.push(...effects);
        }
    });
    if (readied.length > 0) {
        readiedEffects_1.addReadiedToState(readied, state);
        throw errors_1.ControlEnum.NEW_EFFECTS;
    }
};
const filterTelegraphs = (card, state) => {
    const readied = [];
    let telegraphs = card.telegraphs || [];
    const [happenningTelegraphs, remainingTelegraphs] = util_1.splitArray(telegraphs, (mech) => requirements_1.mechReqsMet(mech, card.opponent, card.player, state));
    happenningTelegraphs.forEach((mech) => {
        const mechEffs = readiedEffects_1.mechanicsToReadiedEffects(mech.mechanicEffects, card, state);
        readied.push({ mechanic: mech, card, isEventOnly: true, isHappening: true });
        readied.push(...mechEffs);
    });
    card.telegraphs = remainingTelegraphs;
    if (card.telegraphs && card.telegraphs.length === 0) {
        card.telegraphs = undefined;
    }
    return readied;
};
