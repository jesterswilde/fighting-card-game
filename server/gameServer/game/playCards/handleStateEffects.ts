import { ReadiedEffect, GameState, HappensEnum, DistanceEnum } from "../../interfaces/stateInterface";
import { getSortOrder } from "../../../shared/sortOrder";
import { reduceStateChangeReaEff } from "./effectHappens";
import { splitArray } from "../../util";
import { AxisEnum } from "../../../shared/card";
import { calculatePriority } from "../checkMechanics/priority";

interface OrderPlayerObj {
    [order: number]: {
        [player: number]: ReadiedEffect
    }
}

export const applyStateEffects = (state: GameState) => {
    let stateReaEffs = getStateReaEffs(state);
    markConflicts(stateReaEffs, state);
    stateReaEffs.forEach((playerEffs) => {
        playerEffs.forEach((reaEff) => {
            reduceStateChangeReaEff(reaEff, state)
        })
    });
}

const getStateReaEffs = (state: GameState) => {
    const stateReaEffs: ReadiedEffect[][] = [];
    state.readiedEffects = state.readiedEffects.map((playerEffect, index) => {
        const [stateEffects, unused] = splitArray(playerEffect, (reaEff) => reaEff.mechanic.mechanic === undefined)
        stateReaEffs[index] = stateEffects;
        return unused;
    })
    return stateReaEffs;
}

const markConflicts = (stateReaEffs: ReadiedEffect[][], state: GameState) => {
    const orderedPlayerObj: OrderPlayerObj = {};
    stateReaEffs.forEach((playerEffs, player) => {
        [...playerEffs].reverse().forEach((reaEff) => { //reverse so later ones happen first
            reaEff.happensTo.forEach((happensEnum, targetPlayer) => {
                if (happensEnum === HappensEnum.HAPPENS) {
                    const order = getSortOrder(reaEff.mechanic.axis);
                    orderedPlayerObj[order] = orderedPlayerObj[order] || {};
                    const alreadyAffected = orderedPlayerObj[order][targetPlayer];
                    if (alreadyAffected === undefined) { //Nothing has affected this before
                        orderedPlayerObj[order][targetPlayer] = reaEff;
                    }
                    else if (alreadyAffected.card.player === reaEff.card.player) { //This is affected by an earlier mechanic on the same card
                        reaEff.happensTo[targetPlayer] = HappensEnum.BLOCKED;
                    } else {
                        orderedPlayerObj[order][targetPlayer] = handleConflict(alreadyAffected, reaEff, targetPlayer, state);
                    }
                }
            })
        })
    })
}

const handleConflict = (reaEffA: ReadiedEffect, reaEffB: ReadiedEffect, targetPlayer: number, state: GameState) => {
    if (checkEquality(reaEffA.mechanic.axis, reaEffB.mechanic.axis, state)) return;
    const priorityA = calculatePriority(reaEffA.card); 
    const priorityB = calculatePriority(reaEffB.card); 
    if (priorityA > priorityB) {
        reaEffB.happensTo[targetPlayer] = HappensEnum.BLOCKED;
        return reaEffA;
    }
    if (priorityA < priorityB) {
        reaEffA.happensTo[targetPlayer] = HappensEnum.BLOCKED;
        return reaEffB;
    }
    reaEffA.happensTo[targetPlayer] = HappensEnum.BLOCKED;
    reaEffB.happensTo[targetPlayer] = HappensEnum.BLOCKED;
    return reaEffA;
}

const checkEquality = (axisA: AxisEnum, axisB: AxisEnum, state: GameState): boolean => {
    const resolvedA = resolveRelativeAxis(axisA, state);
    const resolvedB = resolveRelativeAxis(axisB, state);
    return resolvedA === resolvedB;
}

const resolveRelativeAxis = (axis: AxisEnum, state: GameState) => {
    if (axis === AxisEnum.CLOSER) {
        if (state.distance === DistanceEnum.GRAPPLED) return DistanceEnum.GRAPPLED;
        if (state.distance === DistanceEnum.CLOSE) return DistanceEnum.GRAPPLED;
        if (state.distance === DistanceEnum.FAR) return DistanceEnum.CLOSE;
    }
    if (axis === AxisEnum.FURTHER) {
        if (state.distance === DistanceEnum.GRAPPLED) return DistanceEnum.CLOSE;
        if (state.distance === DistanceEnum.CLOSE) return DistanceEnum.FAR;
        if (state.distance === DistanceEnum.FAR) return DistanceEnum.FAR;
    }
    return axis;
}