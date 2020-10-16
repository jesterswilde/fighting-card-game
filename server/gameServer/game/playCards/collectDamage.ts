import {
  GameState,
  ReadiedEffect,
  HappensEnum,
} from "../../interfaces/stateInterface";
import { splitArray } from "../../util";
import { AxisEnum, MechanicEnum } from "../../../shared/card";
import { handleReadiedEffects } from "./effectHappens";
import { collectParry } from "../mechanics/parry";
import { collectBlock } from "../mechanics/block";

export const collectBlockAndDamage = (state: GameState) => {
  collectParry(state);
  collectBlock(state);
  collectDamage(state);
};

export const collectDamage = (state: GameState) => {
  state.readiedEffects = state.readiedEffects.map((playerEff, player) => {
    const [damageEffectsPlayer, otherEffects] = splitArray(
      playerEff,
      ({ effect }) => effect.axis === AxisEnum.DAMAGE
    );
    state.readiedDamageEffects[player] =
      state.readiedDamageEffects[player] || [];
    state.readiedDamageEffects[player].push(...damageEffectsPlayer);
    markDamaged(damageEffectsPlayer, state);
    return otherEffects;
  });
};

const markDamaged = (damageEffects: ReadiedEffect[], state: GameState) => {
  damageEffects.forEach((damageEffect) => {
    damageEffect.happensTo.forEach((happens, player) => {
      if (happens === HappensEnum.HAPPENS) {
        state.damaged[player] = true;
      }
    });
  });
};

export const applyCollectedDamage = (state: GameState) => {
  state.readiedDamageEffects.forEach((playerReaEffs) => {
    playerReaEffs.forEach((reaEff) => handleReadiedEffects(reaEff, state));
  });
  state.readiedDamageEffects = [];
};
