import { GameState, ReadiedEffect } from "../../interfaces/stateInterface";
import { forEachCardInQueue } from "../queue";
import { mechReqsMet } from "../playCards/requirements";
import { mechanicsToReadiedEffects, addReadiedToState } from "../readiedEffects";
import { ControlEnum } from "../../errors";
import { Card } from "../../../shared/card";
import { splitArray } from "../../util";

export const checkTelegraph = (state: GameState) => {
    let readied: ReadiedEffect[] = [];
    forEachCardInQueue(state, (card, queueIndex) => {
        const canTelegraph = queueIndex !== 0;
        if (canTelegraph && card) {
            const effects = filterTelegraphs(card, state);
            readied.push(...effects); 
        }
    })
    if (readied.length > 0) {
        addReadiedToState(readied, state);
        throw ControlEnum.NEW_EFFECTS;
    }
}

const filterTelegraphs = (card: Card, state: GameState) => {
    const readied: ReadiedEffect[] = []
    let telegraphs = card.telegraphs || [];
    const [happenningTelegraphs, remainingTelegraphs] = splitArray(telegraphs, (mech) => mechReqsMet(mech, card.opponent, card.player, state))
    happenningTelegraphs.forEach((mech) => {
        const mechEffs = mechanicsToReadiedEffects(mech.mechanicEffects, card, state);
        readied.push({ mechanic: mech, card, isEventOnly: true, isHappening: true })
        readied.push(...mechEffs)
    })
    card.telegraphs = remainingTelegraphs;
    if (card.telegraphs && card.telegraphs.length === 0) {
        card.telegraphs = undefined;
    }
    return readied; 
}