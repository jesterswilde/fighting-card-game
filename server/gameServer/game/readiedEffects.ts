import { ReadiedEffect, GameState, HappensEnum, ReadiedMechanic } from "../interfaces/stateInterface";
import { Mechanic, Card, PlayerEnum, Effect } from "../../shared/card";
import { deepCopy, getOpponent } from "../util";
import { fill } from 'lodash'

export const readyMechanics = (mechanics: Mechanic[], card: Card): ReadiedMechanic[]=>{
    return mechanics.map(mechanic => ({mechanic, card}));
}
export const readyMechanic = (mechanic: Mechanic, card: Card): ReadiedMechanic=>{
    return ({mechanic, card})
}

export const readyEffects = (effects: Effect[] = [], card: Card, state:GameState): ReadiedEffect[] => {
    return effects.map((eff) => readyEffect(eff, card, state));
}

export const readyEffect = (effect: Effect, card: Card, state: GameState): ReadiedEffect => {
    const happensTo: HappensEnum[] = fill([], HappensEnum.NEVER_AFFECTED, 0, state.numPlayers);
    switch(effect.player){
        case PlayerEnum.PLAYER:
            happensTo[card.player] = HappensEnum.HAPPENS;
            break;
        case PlayerEnum.OPPONENT:
            happensTo[card.opponent] = HappensEnum.HAPPENS;
            break;
        case PlayerEnum.BOTH:
            happensTo[card.player] = HappensEnum.HAPPENS;
            happensTo[card.opponent] = HappensEnum.HAPPENS;
    }
    return { effect: deepCopy(effect), card, happensTo }
}

/*
export const addReadiedToState = (readiedArr: ReadiedEffect[], state: GameState) => {
    readiedArr.forEach((readied) => {
        const player = readied.card.player
        if (typeof player !== 'number') {
            throw new Error('card lacks player');
        }
        state.readiedEffects[player].push(readied);
    })
}
*/