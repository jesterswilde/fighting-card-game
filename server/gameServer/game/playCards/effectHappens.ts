import { GameState, ReadiedEffect, HappensEnum, ReadiedMechanic } from "../../interfaces/stateInterface";
import { MechanicEnum, Mechanic, Card, Effect, AxisEnum } from "../../../shared/card";
import { globalAxis, playerAxis } from "./axis";
import { buffCard } from "../mechanics/buff";
import { addCrippleCardToOpponentsDeck } from "../mechanics/cripple";
import { putFocusesOntoQueueCard } from "../mechanics/focus";
import { movePredictionsToPending } from "../mechanics/predict";
import { markShouldReflexOnQueueCard } from "../mechanics/reflex";
import { putTelegraphsOntoQueueCard } from "../mechanics/telegraph";
import { handleEnhancementMechanic } from "../mechanics/enhance";
import { handleFluid, handleRigid } from "../mechanics/rigidFluid";

export const handleReadiedMechanics = (readiedMechanics: ReadiedMechanic[], state: GameState) => {
    readiedMechanics.forEach(({ mechanic: mech, card }) => {
        const handler = mechanicRouter[mech.mechanic];
        if (handler !== undefined) {
            handler(mech, card, card.player, card.opponent, state);
        } else {
            console.error("There is no reducer for this mechanic.", mech, card); 
        }
    });
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

//Cards that don't require player choice end up here. Forceful and Pick one get handled earlier
const mechanicRouter: { [name: string]: (mechanic: Mechanic, card: Card, player: number, opponent: number, state: GameState) => void } = {
    [MechanicEnum.FOCUS]: putFocusesOntoQueueCard,
    [MechanicEnum.PREDICT]: movePredictionsToPending,
    [MechanicEnum.TELEGRAPH]: putTelegraphsOntoQueueCard,
    [MechanicEnum.ENHANCE]: handleEnhancementMechanic,
}

const effectRouter: { [name: string]: (effect: Effect, card: Card, player: number, opponent: number, state: GameState) => void } = {
    [AxisEnum.BUFF]: buffCard,
    [AxisEnum.CRIPPLE]: addCrippleCardToOpponentsDeck,
    [AxisEnum.REFLEX]: markShouldReflexOnQueueCard,
    [AxisEnum.FLUID]: handleFluid,
    [AxisEnum.RIGID]: handleRigid
}

