import { Card, MechanicEnum } from "../../../shared/card";
import { GameState } from "../../interfaces/stateInterface";
import { splitArray } from "../../util";

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

export const calculatePriority = (card: Card, player: number, state: GameState) => {
    const clutch = card.clutch || 0;
    const priority = card.priority || 0;
    const setup = state.setup[player] || 0; 
    return clutch + priority + setup;
}