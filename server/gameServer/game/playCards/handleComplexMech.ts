import { GameState, ReadiedMechanic } from "../../interfaces/stateInterface";
import { MechanicEnum, Mechanic, Card, Effect, AxisEnum } from "../../../shared/card";
import { putFocusesOntoQueueCard } from "../mechanics/focus";
import { movePredictionsToPending } from "../mechanics/predict";
import { putTelegraphsOntoQueueCard } from "../mechanics/telegraph";
import { handleEnhancementMechanic } from "../mechanics/enhance";

/**Calls the handler for each complex mechanic */
export const applyComplexMech = (state: GameState) => {
    state.readiedMechanics.forEach((reaMech) => {
        handleReadiedComplexMech(reaMech, state);
    })
}

export const handleReadiedComplexMech = (readiedMechanics: ReadiedMechanic[], state: GameState) => {
    readiedMechanics.forEach(({ mechanic: mech, card }) => {
        const handler = mechanicRouter[mech.mechanic];
        if (handler !== undefined) {
            handler(mech, card, card.player, card.opponent, state);
        } else {
            console.error("There is no reducer for this mechanic.", mech, card); 
        }
    });
}


//Cards that don't require player choice end up here. Forceful and Pick one get handled earlier
const mechanicRouter: { [name: string]: (mechanic: Mechanic, card: Card, player: number, opponent: number, state: GameState) => void } = {
    [MechanicEnum.FOCUS]: putFocusesOntoQueueCard,
    [MechanicEnum.PREDICT]: movePredictionsToPending,
    [MechanicEnum.TELEGRAPH]: putTelegraphsOntoQueueCard,
    [MechanicEnum.ENHANCE]: handleEnhancementMechanic,
}


