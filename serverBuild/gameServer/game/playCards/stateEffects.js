"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stateInterface_1 = require("../../interfaces/stateInterface");
const sortOrder_1 = require("../../../shared/sortOrder");
const effectHappens_1 = require("./effectHappens");
const events_1 = require("../events");
exports.handleStateEffects = (state) => {
    const stateReaEffs = getStateReaEffs(state);
    markConflicts(stateReaEffs);
    stateReaEffs.forEach((reaEff) => {
        effectHappens_1.reduceStateChangeReaEff(reaEff, state);
        events_1.stateReaEffEvent(reaEff, state);
    });
};
const getStateReaEffs = (state) => {
    const stateReaEffs = [];
    state.readiedEffects = state.readiedEffects.map((playerEffect) => {
        const unused = playerEffect.map((reaEff) => {
            if (hasImmediateEffect(reaEff)) {
                stateReaEffs.push(reaEff);
                return undefined;
            }
            else {
                return reaEff;
            }
        });
        return unused.filter((reaEff) => reaEff !== undefined);
    });
    return stateReaEffs;
};
const hasImmediateEffect = (readiedEffect) => {
    return readiedEffect.mechanic.mechanic === undefined;
};
const markConflicts = (stateReaEffs) => {
    const orderedPlayerObj = {};
    stateReaEffs.forEach((reaEff) => {
        reaEff.happensTo.forEach((happensEnum, targetPlayer) => {
            if (happensEnum === stateInterface_1.HappensEnum.HAPPENS) {
                const order = sortOrder_1.getSortOrder(reaEff.mechanic.mechanic);
                orderedPlayerObj[order] = orderedPlayerObj[order] || {};
                const alreadyAffected = orderedPlayerObj[order][targetPlayer];
                if (alreadyAffected === undefined) { //Nothing has affected this before
                    orderedPlayerObj[order][targetPlayer] = reaEff;
                }
                else if (alreadyAffected.card.player === reaEff.card.player) { //This is affected by an earlier mechanic on the same card
                    reaEff.happensTo[targetPlayer] = alreadyAffected.happensTo[targetPlayer]; //if the previous one was blocked, this one should be blocked too. 
                    orderedPlayerObj[order][targetPlayer] = reaEff;
                }
                else {
                    orderedPlayerObj[order][targetPlayer] = handleConflict(alreadyAffected, reaEff, targetPlayer);
                }
            }
        });
    });
};
const handleConflict = (reaEffA, reaEffB, targetPlayer) => {
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
