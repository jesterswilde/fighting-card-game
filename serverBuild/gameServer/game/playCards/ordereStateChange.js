"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stateInterface_1 = require("../../interfaces/stateInterface");
const util_1 = require("../../util");
const sortOrder_1 = require("../../../shared/sortOrder");
const lodash_1 = require("lodash");
const buildEffectMap = (state) => {
    const orderedEffects = [];
    state.readiedEffects = state.readiedEffects.map((playerEffect) => {
        const unused = playerEffect.map((reaEff) => {
            return insertIntoMapOrReturn(reaEff, orderedEffects);
        });
        return unused.filter((reaEff) => reaEff !== undefined);
    });
};
const insertIntoMapOrReturn = (reaEff, orderedEffects) => {
    if (hasImmediateEffect(reaEff)) {
        const players = util_1.playerEnumToPlayerArray(reaEff.mechanic.player, reaEff.card.player, reaEff.card.opponent);
        players.forEach((player) => {
            insertReadiedIntoMap(reaEff, player, orderedEffects);
        });
    }
    else {
        return reaEff;
    }
};
const insertReadiedIntoMap = (readiedEffect, affectedPlayer, effectMap) => {
    const playedBy = readiedEffect.card.player;
    const order = sortOrder_1.getSortOrder(readiedEffect.mechanic.axis);
    effectMap[order] = effectMap[order] || {};
    effectMap[order][affectedPlayer] = effectMap[order][affectedPlayer] || {};
    effectMap[order][affectedPlayer][playedBy] = readiedEffect;
};
const hasImmediateEffect = (readiedEffect) => {
    return readiedEffect.mechanic.mechanic === undefined;
};
const markConflicts = (orderedEffects) => {
    orderedEffects.forEach((effectMap) => {
        lodash_1.forEach(effectMap, (playedByObj, affectedPlayer) => {
            markConflict(Number(affectedPlayer), playedByObj);
        });
    });
};
const markConflict = (affectedPlayer, playerEffects) => {
    let highestPriority;
    let highestReaEff;
    lodash_1.forEach(playerEffects, (reaEff) => {
        if (highestPriority === undefined || reaEff.card.priority > highestPriority) {
            highestPriority = reaEff.card.priority;
            highestReaEff = reaEff;
        }
    });
    let conflict = false;
    lodash_1.forEach(playerEffects, (reaEff) => {
        if (reaEff.card.priority < highestPriority) {
            reaEff.happensTo[affectedPlayer] = stateInterface_1.HappensEnum.BLOCKED;
        }
        if (reaEff.card.priority === highestPriority && reaEff !== highestReaEff) {
            reaEff.happensTo[affectedPlayer] = stateInterface_1.HappensEnum.BLOCKED;
            conflict = true;
        }
    });
    if (conflict) {
        highestReaEff.happensTo[affectedPlayer] = stateInterface_1.HappensEnum.BLOCKED;
    }
};
