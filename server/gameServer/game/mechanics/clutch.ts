import { GameState } from "../../interfaces/stateInterface";
import { splitArray } from "../../util";
import { MechanicEnum, AxisEnum } from "../../../shared/card";

/*
    Clutch increases the priority of a card.
    Clutch is always the child of some other mechanic (Like optional, forceful or choose)
    Clutch is removed from a card when that card is culled from the queue
*/

export const applyClutch = (state: GameState) => {
    state.readiedEffects = state.readiedEffects.map((playerReaffs, player) => {
        const [clutchArr, unusedArr] = splitArray(playerReaffs, ({ effect }) => effect.axis === AxisEnum.CLUTCH)
        clutchArr.forEach(({ effect, card }) => {
            const clutch = card.clutch ? card.clutch : 0;
            card.clutch = clutch + Number(effect.amount);
        })
        return unusedArr;
    });
};
