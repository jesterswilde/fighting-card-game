import { GameState, ReadiedEffect } from "../../interfaces/stateInterface";
import { MechanicEnum, Mechanic, Effect } from "../../../shared/card";
import { makeReadyEffects } from "../readiedEffects";
import { splitArray } from "../../util";
import { addDisplayEvent, makeEventsFromReadied, startNewEvent } from "../events";
import { EventType } from "../../interfaces/gameEvent";

/*
    A player is given a few choices by a card, and get to pick only one. 
*/

export const playerPicksOne = async (player: number, state: GameState) => {
  const { agents } = state;
  const [pickedOne, unused] = splitArray(
    state.readiedMechanics[player],
    (reaMech) => reaMech.mechanic.mechanic === MechanicEnum.PICK_ONE,
  );
  state.readiedMechanics[player] = unused;
  for (let i = 0; i < pickedOne.length; i++) {
    const { mechanic, card } = pickedOne[i];
    const choice = await agents[player].getPickOneChoice({
      cardName: card.name,
      index: mechanic.index,
    });
    const picked = mechanic.choices?.[choice];
    if (!Number.isInteger(choice) || !picked) {
      throw new Error("Invalid Pick One choice");
    }
    state.readiedEffects[player].push(...makeReadyEffects(picked, card));
    addDisplayEvent("Picked One", player, state, true);
  }
};
