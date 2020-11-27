import { GameState, ReadiedEffect, ReadiedMechanic } from "../../interfaces/stateInterface";
import { splitArray } from "../../util";
import { MechanicEnum, Mechanic, Card } from "../../../shared/card";
import { makeReadyEffects } from "../readiedEffects";
import { addDisplayEvent, makeEventsFromReadied, startNewEvent } from "../events";
import { readyEffectsAndMechanics } from "../playCard";

/*
    Give up N poise, to gain an effect. 
    Forceful is it's own choice, but only shows up if you can pay it. 
*/

export const playerChoosesForce = async (player: number, state: GameState) => {
  const [valid, unused] = getValidAndUnusedForceful(state, player)
  const newEffs = await playerChoosesFromValid(valid, player, state)
  if(newEffs.length > 0){
    state.readiedEffects[player].push(...newEffs); 
    addDisplayEvent("Forceful", player, state, true)
  }
  state.readiedMechanics[player] = unused;
};

const getValidAndUnusedForceful = (state: GameState, player: number)=>{
  const { readiedMechanics = [] } = state;
  let readiedMechs = readiedMechanics[player] || [];
  let [forcefulMechs, unused] = splitArray(
    readiedMechs,
    ({ mechanic }) => mechanic.mechanic === MechanicEnum.FORCEFUL
  );
  const validForcefulArr = forcefulMechs.filter(
    ({ mechanic }) => state.playerStates[player].poise >= mechanic.amount
  );
  return [validForcefulArr, unused]
}
const playerChoosesFromValid = async(valid: ReadiedMechanic[], player: number, state: GameState)=>{
  let newEffs: ReadiedEffect[] = [];
  for (let i = 0; i < valid.length; i++) {
    const {card: { name: cardName }, mechanic, card,} = valid[i];
    const choseToPlay = await state.agents[player].getUsedForceful({cardName, index: mechanic.index});
    if (choseToPlay) {
      state.playerStates[player].poise -= mechanic.amount;
      newEffs.push(...makeReadyEffects(mechanic.effects, card));
    }
  }
  return newEffs
}