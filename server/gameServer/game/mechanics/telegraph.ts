import { GameState, ReadiedEffect } from "../../interfaces/stateInterface";
import { forEachCardInQueue } from "../queue";
import { mechReqsMet } from "../playCards/requirements";
import { readyEffects } from "../readiedEffects";
import { ControlEnum } from "../../errors";
import { Card, Mechanic } from "../../../shared/card";
import { splitArray } from "../../util";

/*
    Telegraphs get checked at the end of each turn (except the first)
    If the requirements for a telegraph are met, the effect happens. 
    Telegraphs can only happen once, so they get removed once triggered.
    Telgraphs also get removed when the card is culled from the queue. 
*/

export const putTelegraphsOntoQueueCard = (mechanic: Mechanic, card: Card, player: number, opponent: number, state: GameState) => {
    card.telegraphs = card.telegraphs || [];
    card.telegraphs.push(mechanic);
}

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
        readied.forEach(reaEff => state.readiedEffects[reaEff.card.player].push(reaEff))
        throw ControlEnum.NEW_EFFECTS;
    }
}

const filterTelegraphs = (card: Card, state: GameState) => {
    const readied: ReadiedEffect[] = []
    let telegraphs = card.telegraphs || [];
    const [happenningTelegraphs, remainingTelegraphs] = splitArray(telegraphs, (mech) => mechReqsMet(mech, card.opponent, card.player, state))
    happenningTelegraphs.forEach((mech) => {
        const mechEffs = readyEffects(mech.effects, card, state);
        readied.push(...mechEffs)
    })
    card.telegraphs = remainingTelegraphs;
    if (card.telegraphs && card.telegraphs.length === 0) {
        card.telegraphs = undefined;
    }
    return readied; 
}