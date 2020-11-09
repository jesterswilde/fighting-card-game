import { GameState, ReadiedEffect } from "../../interfaces/stateInterface";
import { splitArray } from "../../util";
import { MechanicEnum, Mechanic, Card } from "../../../shared/card";
import { makeReadyEffects } from "../readiedEffects";
import { addDisplayEvent, makeEventsFromReadied, startNewEvent } from "../events";

/*
    Give up N poise, to gain an effect. 
    Forceful is it's own choice, but only shows up if you can pay it. 
*/

export const playerChoosesForce = async (player: number, state: GameState) => {
  const { readiedMechanics = [] } = state;
  let readiedMechs = readiedMechanics[player] || [];
  let [forcefulMechs, unused] = splitArray(
    readiedMechs,
    ({ mechanic }) => mechanic.mechanic === MechanicEnum.FORCEFUL
  );
  const validForcefulArr = forcefulMechs.filter(
    ({ mechanic }) => state.playerStates[player].poise >= mechanic.amount
  );
  let readiedEffs: ReadiedEffect[] = [];
  for (let i = 0; i < validForcefulArr.length; i++) {
    const {card: { name: cardName }, mechanic, card,} = validForcefulArr[i];
    console.log("Sending forceful question")
    const choseToPlay = await state.agents[player].getUsedForceful({cardName, index: mechanic.index});
    console.log("Did choose to play: ", choseToPlay)
    if (choseToPlay) {
      state.playerStates[player].poise -= mechanic.amount;
      readiedEffs.push(...makeReadyEffects(mechanic.effects, card));
      addDisplayEvent("Forceful", player, state)
      makeEventsFromReadied(state); 
    }
  }
  state.readiedEffects[player].push(...readiedEffs); 
  state.readiedMechanics[player] = [...unused];
};