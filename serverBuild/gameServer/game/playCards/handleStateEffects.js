"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stateInterface_1 = require("../../interfaces/stateInterface");
const sortOrder_1 = require("../../../shared/sortOrder");
const effectHappens_1 = require("./effectHappens");
const util_1 = require("../../util");
const card_1 = require("../../../shared/card");
const priority_1 = require("../mechanics/priority");
exports.applyStateEffects = (state) => {
    let stateReaEffs = getStateReaEffs(state);
    markConflicts(stateReaEffs, state);
    stateReaEffs.forEach((playerEffs) => {
        playerEffs.forEach((reaEff) => {
            effectHappens_1.handleReadiedEffects(reaEff, state);
        });
    });
};
const getStateReaEffs = (state) => {
    const stateReaEffs = [];
    state.readiedEffects = state.readiedEffects.map((playerEffect, index) => {
        const [stateEffects, unused] = util_1.splitArray(playerEffect, ({ effect: { axis } }) => isStateAxis(axis));
        stateReaEffs[index] = stateEffects;
        return unused;
    });
    return stateReaEffs;
};
const stateAxisSet = new Set([
    card_1.AxisEnum.MOVING,
    card_1.AxisEnum.STILL,
    card_1.AxisEnum.PRONE,
    card_1.AxisEnum.STANCE,
    card_1.AxisEnum.GRAPPLED,
    card_1.AxisEnum.CLOSE,
    card_1.AxisEnum.FAR,
    card_1.AxisEnum.FURTHER,
    card_1.AxisEnum.CLOSER,
]);
const isStateAxis = (axis) => {
    return stateAxisSet.has(axis);
};
const markConflicts = (stateReaEffs, state) => {
    const axisGroupPlayerObj = {};
    stateReaEffs.forEach((playerEffs, player) => {
        playerEffs.forEach((reaEff) => {
            reaEff.happensTo.forEach((happensEnum, targetPlayer) => {
                if (happensEnum === stateInterface_1.HappensEnum.HAPPENS) {
                    const axisGroup = sortOrder_1.getAxisGroup(reaEff.effect.axis);
                    axisGroupPlayerObj[axisGroup] = axisGroupPlayerObj[axisGroup] || {};
                    const alreadyAffected = axisGroupPlayerObj[axisGroup][targetPlayer];
                    if (alreadyAffected === undefined) {
                        //Nothing has affected this before
                        axisGroupPlayerObj[axisGroup][targetPlayer] = reaEff;
                    }
                    else if (alreadyAffected.card.player === reaEff.card.player) {
                        //This is affected by an earlier mechanic on the same card
                        reaEff.happensTo[targetPlayer] = stateInterface_1.HappensEnum.BLOCKED;
                    }
                    else {
                        axisGroupPlayerObj[axisGroup][targetPlayer] = handleConflict(alreadyAffected, reaEff, targetPlayer, state);
                    }
                }
            });
        });
    });
};
const handleConflict = (reaEffA, reaEffB, targetPlayer, state) => {
    if (checkEquality(reaEffA.effect.axis, reaEffB.effect.axis, state))
        return;
    const priorityA = priority_1.calculatePriority(reaEffA.card, reaEffA.card.player, state);
    const priorityB = priority_1.calculatePriority(reaEffB.card, reaEffB.card.player, state);
    if (priorityA > priorityB) {
        reaEffB.happensTo[targetPlayer] = stateInterface_1.HappensEnum.BLOCKED;
        return reaEffA;
    }
    if (priorityA < priorityB) {
        reaEffA.happensTo[targetPlayer] = stateInterface_1.HappensEnum.BLOCKED;
        return reaEffB;
    }
    //They are equal, so block 'em both
    reaEffA.happensTo[targetPlayer] = stateInterface_1.HappensEnum.BLOCKED;
    reaEffB.happensTo[targetPlayer] = stateInterface_1.HappensEnum.BLOCKED;
    return reaEffA;
};
const checkEquality = (axisA, axisB, state) => {
    const resolvedA = resolveRelativeAxis(axisA, state);
    const resolvedB = resolveRelativeAxis(axisB, state);
    return resolvedA === resolvedB;
};
const resolveRelativeAxis = (axis, state) => {
    if (axis === card_1.AxisEnum.CLOSER) {
        if (state.distance === stateInterface_1.DistanceEnum.GRAPPLED)
            return stateInterface_1.DistanceEnum.GRAPPLED;
        if (state.distance === stateInterface_1.DistanceEnum.CLOSE)
            return stateInterface_1.DistanceEnum.GRAPPLED;
        if (state.distance === stateInterface_1.DistanceEnum.FAR)
            return stateInterface_1.DistanceEnum.CLOSE;
    }
    if (axis === card_1.AxisEnum.FURTHER) {
        if (state.distance === stateInterface_1.DistanceEnum.GRAPPLED)
            return stateInterface_1.DistanceEnum.CLOSE;
        if (state.distance === stateInterface_1.DistanceEnum.CLOSE)
            return stateInterface_1.DistanceEnum.FAR;
        if (state.distance === stateInterface_1.DistanceEnum.FAR)
            return stateInterface_1.DistanceEnum.FAR;
    }
    return axis;
};
