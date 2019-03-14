import { MechanicEnum } from "../../shared/card";
import { GameState, ReadiedEffect, PredictionEvent } from "../interfaces/stateInterface";
import { EventTypeEnum, EventAction } from "../interfaces/gameEvent";
import { SocketEnum } from "../../shared/socket";
import { getCorrectGuessArray } from "./playCards/predictions";
import { calculatePriority } from "./checkMechanics/priority";


export const addReflexEffects = (players: string[], state: GameState) => {
    let lastEvent = state.events[state.events.length - 1];
    players.forEach((cardName, playedBy)=>{
        if(cardName && Array.isArray(lastEvent.events) && Array.isArray(lastEvent.events[playedBy].events)){
            lastEvent.events[playedBy].events.push({ type: EventTypeEnum.MECHANIC, mechanicName: MechanicEnum.REFLEX, cardName, playedBy })
        }
    })
}

export const storeEffectsForEvents = (state: GameState) => {
    state.pendingEvents = [...state.readiedEffects];
}


export const processEffectEvents = (state: GameState) => {
    const events: EventAction[] = state.pendingEvents.map((playerReaEff, player) => {
        const events = playerReaEff.map((reaEff) => reaEfftoEvent(reaEff))
        return { type: EventTypeEnum.MULTIPLE, events };
    })
    state.events.push({ type: EventTypeEnum.EVENT_SECTION, events });
    state.pendingEvents = undefined;
}


export const storePlayedCardEvent = (player: number, state: GameState) => {
    const card = state.pickedCards[player];
    state.pendingCardEvents = state.pendingCardEvents || [];
    state.pendingCardEvents[player] = card;
}

export const processPlayedCardEvents = (state: GameState) => {
    if (state.pendingCardEvents === undefined) return;
    const events: EventAction[] = state.pendingCardEvents.map((card) => {
        if (card) {
            return { type: EventTypeEnum.CARD_NAME, priority: calculatePriority(card, card.player, state), cardName: card.name, playedBy: card.player };
        }
        return null;
    });
    state.events.push({ events, type: EventTypeEnum.CARD_NAME_SECTION });
    state.pendingCardEvents = undefined;
}

const reaEfftoEvent = (reaEff: ReadiedEffect): EventAction => {
    const { mechanic: mech, isHappening, card, isEventOnly, happensTo } = reaEff;
    //These are for thigns like damage, block, and things that get printed in that format
    if (mech.mechanic === undefined || (addableMechanics[reaEff.mechanic.mechanic] && !reaEff.isHappening)) {
        return { type: EventTypeEnum.EFFECT, effect: reaEff.mechanic, playedBy: card.player, happenedTo: happensTo }
    } //This is for when a telegraph, reflex, or focus is actually triggered 
    else if (isHappening && isEventOnly) {
        return { type: EventTypeEnum.MECHANIC, mechanicName: mech.mechanic, cardName: card.name, playedBy: card.player }
    }//This is for when delayed mechanics are added, but have no current effect. 
    else if (!ignoredMechanics[mech.mechanic] || isEventOnly) {
        return { type: EventTypeEnum.ADDED_MECHANIC, mechanicName: mech.mechanic, playedBy: card.player };
    }
}

// export const stateReaEffEvent = (reaEffs: ReadiedEffect, state: GameState) => {
//     state.events.push({ type: EventTypeEnum.EFFECT, playedBy: reaEffs.card.player, effect: reaEffs.mechanic, happenedTo: reaEffs.happensTo });
// }

export const addGameOverEvent = (winner: number, state: GameState) => {
    state.events.push({ type: EventTypeEnum.GAME_OVER, winner })
}


export const addRevealPredictionEvent = (predEvents: PredictionEvent[], state: GameState) => {
    const hasEvents = predEvents.some((a)=> a !== undefined && a !== null); 
    if(hasEvents){
        const playerEvents: EventAction[] = predEvents.map((predEvent, player)=>{
            const correctGuesses = getCorrectGuessArray(predEvent.targetPlayer, state); 
            return { type: EventTypeEnum.REVEAL_PREDICTION, correct: predEvent.didHappen, prediction: predEvent.prediction, correctGuesses}
        })
        state.events.push({type: EventTypeEnum.PREDICTION_SECTION, events: playerEvents});
    }
}


export const sendEvents = (state: GameState) => {
    state.sockets.forEach((socket) => {
        socket.emit(SocketEnum.GOT_EVENTS, state.events);
    })
    state.events = [];
}
//These are ignored because they are handled later.
const ignoredMechanics: { [name: string]: boolean } = {
    [MechanicEnum.REFLEX]: true,
}

//They have their own printed versions
const addableMechanics: { [name: string]: boolean } = {
    [MechanicEnum.BLOCK]: true,
    [MechanicEnum.PARRY]: true,
    [MechanicEnum.CRIPPLE]: true,
    [MechanicEnum.LOCK]: true,
    [MechanicEnum.FORCEFUL]: true,
}