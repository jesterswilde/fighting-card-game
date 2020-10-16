import {
  ReadiedEffect,
  GameState,
  HappensEnum,
  DistanceEnum,
} from "../../interfaces/stateInterface";
import { getAxisGroup as getAxisGroup } from "../../../shared/sortOrder";
import { handleReadiedEffects } from "./effectHappens";
import { splitArray } from "../../util";
import { AxisEnum } from "../../../shared/card";
import { calculatePriority } from "../mechanics/priority";

interface OrderPlayerObj {
  [order: number]: {
    [player: number]: ReadiedEffect;
  };
}

export const applyStateEffects = (state: GameState) => {
  let stateReaEffs = getStateReaEffs(state);
  markConflicts(stateReaEffs, state);
  stateReaEffs.forEach((playerEffs) => {
    playerEffs.forEach((reaEff) => {
      handleReadiedEffects(reaEff, state);
    });
  });
};

const getStateReaEffs = (state: GameState) => {
  const stateReaEffs: ReadiedEffect[][] = [];
  state.readiedEffects = state.readiedEffects.map((playerEffect, index) => {
    const [stateEffects, unused] = splitArray(
      playerEffect,
      ({ effect: { axis } }) => isStateAxis(axis)
    );
    stateReaEffs[index] = stateEffects;
    return unused;
  });
  return stateReaEffs;
};

const stateAxisSet = new Set([
  AxisEnum.MOVING,
  AxisEnum.STILL,
  AxisEnum.PRONE,
  AxisEnum.STANCE,
  AxisEnum.GRAPPLED,
  AxisEnum.CLOSE,
  AxisEnum.FAR,
  AxisEnum.FURTHER,
  AxisEnum.CLOSER,
]);

const isStateAxis = (axis: AxisEnum) => {
  return stateAxisSet.has(axis);
};

const markConflicts = (stateReaEffs: ReadiedEffect[][], state: GameState) => {
  const axisGroupPlayerObj: OrderPlayerObj = {};
  stateReaEffs.forEach((playerEffs, player) => {
    playerEffs.forEach((reaEff) => {
      reaEff.happensTo.forEach((happensEnum, targetPlayer) => {
        if (happensEnum === HappensEnum.HAPPENS) {
          const axisGroup = getAxisGroup(reaEff.effect.axis);
          axisGroupPlayerObj[axisGroup] = axisGroupPlayerObj[axisGroup] || {};
          const alreadyAffected = axisGroupPlayerObj[axisGroup][targetPlayer];
          if (alreadyAffected === undefined) {
            //Nothing has affected this before
            axisGroupPlayerObj[axisGroup][targetPlayer] = reaEff;
          } else if (alreadyAffected.card.player === reaEff.card.player) {
            //This is affected by an earlier mechanic on the same card
            reaEff.happensTo[targetPlayer] = HappensEnum.BLOCKED;
          } else {
            axisGroupPlayerObj[axisGroup][targetPlayer] = handleConflict(
              alreadyAffected,
              reaEff,
              targetPlayer,
              state
            );
          }
        }
      });
    });
  });
};

const handleConflict = (
  reaEffA: ReadiedEffect,
  reaEffB: ReadiedEffect,
  targetPlayer: number,
  state: GameState
) => {
  if (checkEquality(reaEffA.effect.axis, reaEffB.effect.axis, state)) return;
  const priorityA = calculatePriority(reaEffA.card, reaEffA.card.player, state);
  const priorityB = calculatePriority(reaEffB.card, reaEffB.card.player, state);
  if (priorityA > priorityB) {
    reaEffB.happensTo[targetPlayer] = HappensEnum.BLOCKED;
    return reaEffA;
  }
  if (priorityA < priorityB) {
    reaEffA.happensTo[targetPlayer] = HappensEnum.BLOCKED;
    return reaEffB;
  }
  //They are equal, so block 'em both
  reaEffA.happensTo[targetPlayer] = HappensEnum.BLOCKED;
  reaEffB.happensTo[targetPlayer] = HappensEnum.BLOCKED;
  return reaEffA;
};

const checkEquality = (
  axisA: AxisEnum,
  axisB: AxisEnum,
  state: GameState
): boolean => {
  const resolvedA = resolveRelativeAxis(axisA, state);
  const resolvedB = resolveRelativeAxis(axisB, state);
  return resolvedA === resolvedB;
};

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
};
