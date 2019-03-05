"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stateInterface_1 = require("../../interfaces/stateInterface");
const sortOrder_1 = require("../../../shared/sortOrder");
const effectHappens_1 = require("./effectHappens");
const util_1 = require("../../util");
const card_1 = require("../../../shared/card");
exports.applyStateEffects = (state) => {
    let stateReaEffs = getStateReaEffs(state);
    markConflicts(stateReaEffs, state);
    stateReaEffs.forEach((playerEffs) => {
        playerEffs.forEach((reaEff) => {
            effectHappens_1.reduceStateChangeReaEff(reaEff, state);
        });
    });
};
const getStateReaEffs = (state) => {
    const stateReaEffs = [];
    state.readiedEffects = state.readiedEffects.map((playerEffect, index) => {
        const [stateEffects, unused] = util_1.splitArray(playerEffect, (reaEff) => reaEff.mechanic.mechanic === undefined);
        stateReaEffs[index] = stateEffects;
        return unused;
    });
    return stateReaEffs;
};
const markConflicts = (stateReaEffs, state) => {
    const orderedPlayerObj = {};
    stateReaEffs.forEach((playerEffs, player) => {
        [...playerEffs].reverse().forEach((reaEff) => {
            reaEff.happensTo.forEach((happensEnum, targetPlayer) => {
                if (happensEnum === stateInterface_1.HappensEnum.HAPPENS) {
                    const order = sortOrder_1.getSortOrder(reaEff.mechanic.axis);
                    orderedPlayerObj[order] = orderedPlayerObj[order] || {};
                    const alreadyAffected = orderedPlayerObj[order][targetPlayer];
                    if (alreadyAffected === undefined) { //Nothing has affected this before
                        orderedPlayerObj[order][targetPlayer] = reaEff;
                    }
                    else if (alreadyAffected.card.player === reaEff.card.player) { //This is affected by an earlier mechanic on the same card
                        reaEff.happensTo[targetPlayer] = stateInterface_1.HappensEnum.BLOCKED;
                    }
                    else {
                        orderedPlayerObj[order][targetPlayer] = handleConflict(alreadyAffected, reaEff, targetPlayer, state);
                    }
                }
            });
        });
    });
};
const handleConflict = (reaEffA, reaEffB, targetPlayer, state) => {
    if (checkEquality(reaEffA.mechanic.axis, reaEffB.mechanic.axis, state))
        return;
    if (reaEffA.card.priority > reaEffB.card.priority) {
        reaEffB.happensTo[targetPlayer] = stateInterface_1.HappensEnum.BLOCKED;
        return reaEffA;
    }
    if (reaEffA.card.priority < reaEffB.card.priority) {
        reaEffA.happensTo[targetPlayer] = stateInterface_1.HappensEnum.BLOCKED;
        return reaEffB;
    }
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
