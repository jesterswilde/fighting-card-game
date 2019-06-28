import { GameState, ReadiedEffect, HappensEnum } from "../../interfaces/stateInterface";
import { MechanicEnum, Mechanic, Card } from "../../../shared/card";
import { globalAxis, playerAxis } from "./axis";
import { reduceBlock } from "../mechanics/block";
import { reduceBuff } from "../mechanics/buff";
import { reduceCripple } from "../mechanics/cripple";
import { reduceFocus } from "../mechanics/focus";
import { reducePredict } from "../mechanics/predict";
import { reduceReflex } from "../mechanics/reflex";
import { reduceTelegraph } from "../mechanics/telegraph";
import { reduceEnhance } from "../mechanics/enhance";
import { reduceSetup } from "../mechanics/setup";

export const reduceMechanics = (readiedMechanics: ReadiedEffect[], state: GameState) => {
    readiedMechanics.forEach(({ mechanic: mech, card, isEventOnly }) => {
        const reducer = mechanicRouter[mech.mechanic];
        if (isEventOnly) return;
        if (reducer !== undefined) {
            reducer(mech, card, card.player, card.opponent, state);
        } else {
            console.error("There is no reducer for this mechanic.", mech, card); 
            
        }
    });
}

export const reduceStateChangeReaEff = (reaEff: ReadiedEffect, state: GameState) => {
    const whoToCheck = reaEff.happensTo.map((value, i) => value === HappensEnum.HAPPENS ? i : null)
        .filter((value) => value !== null);
    reduceStateChange(reaEff.mechanic, reaEff.card, reaEff.card.player, reaEff.card.opponent, state, whoToCheck);
}

const reduceStateChange = (mechanic: Mechanic, card: Card, player: number, opponent: number, state: GameState, appliesTo: number[]) => {
    const applyGlobal = globalAxis[mechanic.axis];
    if (appliesTo.length === 0) {
        return;
    }
    if (applyGlobal !== undefined) {
        applyGlobal(state);
    }
    let amount: number | null;
    if (mechanic.amount !== undefined && mechanic.amount !== null) {
        amount = Number(mechanic.amount)
    } else {
        amount = null;
    }
    const applyPlayerState = playerAxis[mechanic.axis];
    if (applyPlayerState !== undefined && (amount === undefined || !isNaN(amount))) {
        applyPlayerState(appliesTo, amount, state);
    }
}

const mechanicRouter: { [name: string]: (mechanic: Mechanic, card: Card, player: number, opponent: number, state: GameState) => void } = {
    [MechanicEnum.BLOCK]: reduceBlock,
    [MechanicEnum.BUFF]: reduceBuff,
    [MechanicEnum.CRIPPLE]: reduceCripple,
    [MechanicEnum.FOCUS]: reduceFocus,
    [MechanicEnum.PREDICT]: reducePredict,
    [MechanicEnum.REFLEX]: reduceReflex,
    [MechanicEnum.TELEGRAPH]: reduceTelegraph,
    [MechanicEnum.ENHANCE]: reduceEnhance,
    [MechanicEnum.SETUP]: reduceSetup,
}

