import { GameState, ReadiedEffect } from "../../interfaces/stateInterface";
import { mechReqsMet } from "../playCards/requirements";
import { mechanicsToReadiedEffects, addReadiedToState } from "../readiedEffects";
import { ControlEnum } from "../../errors";
import { forEachCardInQueue } from "../queue";
import { Card, Mechanic } from "../../../shared/card";

/*
    Focus happens at the end of every turn. 
    If I card has focus, the requirements of the focus are checked. 
    If the requirement is met, the effect happens. 
    Active focus lives on the card, it is removed when the card is put into the queue. 
*/

export const reduceFocus = (mechanic: Mechanic, card: Card, player: number, opponent: number, state: GameState) => {
    card.focuses = card.focuses || [];
    card.focuses.push(mechanic);
}


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