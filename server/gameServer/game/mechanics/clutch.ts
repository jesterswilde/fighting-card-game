import { GameState } from "../../interfaces/stateInterface";
import { splitArray } from "../../util";
import { MechanicEnum } from "../../../shared/card";

/*
    Clutch increases the priority of a card.
    Clutch is always the child of some other mechanic (Like optional, forceful or choose)
    Clutch is removed from a card when that card is culled from the queue
*/

export const applyClutch = (state: GameState) => {
    state.readiedEffects = state.readiedEffects.map((playerReaffs, player) => {
        const [clutchArr, unusedArr] = splitArray(playerReaffs, ({ mechanic }) => mechanic.mechanic === MechanicEnum.CLUTCH)
        clutchArr.forEach(({ mechanic, card }) => {
            const clutch = card.clutch ? card.clutch : 0;
            card.clutch = clutch + Number(mechanic.amount);
        })
        return unusedArr;
    });
};
