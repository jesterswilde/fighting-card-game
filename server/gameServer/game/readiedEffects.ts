import { ReadiedEffect, GameState, HappensEnum } from "../interfaces/stateInterface";
import { Mechanic, Card, PlayerEnum } from "../../shared/card";
import { deepCopy, getOpponent } from "../util";
import { fill } from 'lodash'

export const mechanicsToReadiedEffects = (mechanics: Mechanic[] = [], card: Card, state:GameState): ReadiedEffect[] => {
    return mechanics.map((mech) => mechanicToReadiedEffect(mech, card, state));
}

export const mechanicToReadiedEffect = (mechanic: Mechanic, card: Card, state: GameState): ReadiedEffect => {
    const happensTo: HappensEnum[] = fill([], HappensEnum.NEVER_AFFECTED, 0, state.numPlayers);
    switch(mechanic.player){
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
    return { mechanic: deepCopy(mechanic), card, happensTo }
}

export const addReadiedToState = (readiedArr: ReadiedEffect[], state: GameState) => {
    readiedArr.forEach((readied) => {
        const player = readied.card.player
        if (typeof player !== 'number') {
            throw new Error('card lacks player');
        }
        state.readiedEffects[player].push(readied);
    })
}