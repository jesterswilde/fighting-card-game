import { GameState, ReadiedEffect } from "../../interfaces/stateInterface";
import { mechReqsMet } from "../playCards/requirements";
import { mechanicsToReadiedEffects, addReadiedToState } from "../readiedEffects";
import { ControlEnum } from "../../errors";
import { forEachCardInQueue } from "../queue";
import { Card } from "../../../shared/card";


export const checkFocus = (state: GameState) => {
    if (state.checkedFocus) {
        return;
    }
    state.checkedFocus = true;
    let modifiedState = false;
    const readied:ReadiedEffect[] = []
    forEachCardInQueue(state, (card) => {
        if (card.focuses) {
            const focusEffects = getReadiedFromCard(card, state);
            readied.push(...focusEffects); 
        }
    })
    if (readied.length > 0) {
        addReadiedToState(readied, state); 
        modifiedState = true;
        throw ControlEnum.NEW_EFFECTS;
    }
}

const getReadiedFromCard = (card: Card, state: GameState) => {
    return card.focuses
        .filter((mech) => mechReqsMet(mech, card.opponent, card.player, state))
        .reduce((readied: ReadiedEffect[], mech) => {
            const readiedEff = mechanicsToReadiedEffects(mech.mechanicEffects, card, state);
            readied.push(...readiedEff);
            return readied;
        }, []);
}