import { Card, MechanicEnum } from "../../../shared/card";
import { GameState } from "../../interfaces/stateInterface";

/*
    Priority is the process by which conflicting states is resolved. 
    Priority is the base card's priority plus clutch (on card) plus setup (on state)
*/

export const calculatePriority = (card: Card, player: number, state: GameState) => {
    const clutch = card.clutch || 0;
    const priority = card.priority || 0;
    const setup = state.setup[player] || 0; 
    return clutch + priority + setup;
}