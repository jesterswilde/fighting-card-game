import {
  ReadiedEffect,
  GameState,
  HappensEnum,
  DistanceEnum,
} from "../../interfaces/stateInterface";
import { getAxisGroup as getAxisGroup } from "../../../shared/sortOrder";
import { splitArray } from "../../util";
import { AxisEnum, Card, Effect } from "../../../shared/card";
import { calculatePriority } from "../mechanics/priority";
import { globalAxis, playerAxis } from "./axis";

interface OrderPlayerObj {
  [order: number]: {
    [player: number]: ReadiedEffect;
  };
}

export const handleReadiedEffects = (reaEff: ReadiedEffect, state: GameState) => {
    const whoToCheck = reaEff.happensTo.map((value, i) => value === HappensEnum.HAPPENS ? i : null)
        .filter((value) => value !== null);
    handleStateChange(reaEff.effect, reaEff.card, reaEff.card.player, reaEff.card.opponent, state, whoToCheck);
}

const handleStateChange = (effect: Effect, card: Card, player: number, opponent: number, state: GameState, appliesTo: number[]) => {
    const applyGlobal = globalAxis[effect.axis];
    if (appliesTo.length === 0) {
        return;
    }
    if (applyGlobal !== undefined) {
        applyGlobal(state);
    }
    let amount: number | null;
    if (effect.amount !== undefined && effect.amount !== null) {
        amount = Number(effect.amount)
    } else {
        amount = null;
    }
    const applyPlayerState = playerAxis[effect.axis];
    if (applyPlayerState !== undefined && (amount === undefined || !isNaN(amount))) {
        applyPlayerState(appliesTo, amount, state);
    }
}
export const applyStateEffects = (state: GameState) => {
  console.log("Applying effects"); 
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
