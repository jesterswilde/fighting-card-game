import { Mechanic, MechanicEnum, Card } from "../interfaces/cardInterface";
import { GameState, PredictionEnum } from "../interfaces/stateInterface";
import { EventTypeEnum } from "../interfaces/gameEvent";
import { SocketEnum } from "../interfaces/socket";

export const addEffectEvent = (mechanic: Mechanic, playedBy: number, name: string, isEventOnly: boolean, isHappening: boolean, state: GameState) => {
    console.log(mechanic.mechanic, name, isEventOnly, isHappening)
    //These are for thigns like damage, block, and things that get printed in that format
    if (mechanic.mechanic === undefined || (addableMechanics[mechanic.mechanic] && !isHappening)) {
        state.events.push({ effect: mechanic, type: EventTypeEnum.EFFECT, playedBy });
    } //This is for when a telegraph, reflex, or focus is actually triggered 
    else if(isHappening && isEventOnly) {
        mechanicIsHappeningEvent(mechanic.mechanic, name, playedBy, state); 
    }//This is for when delayed mechanics are added, but have no current effect. 
    else if(!ignoredMechanics[mechanic.mechanic] || isEventOnly){
        addedMechanicEvent(mechanic.mechanic, playedBy, state);
    }
}
export const mechanicIsHappeningEvent = (mechEnum: MechanicEnum, cardName: string, playedBy: number, state: GameState) => {
    console.log("adding effect event",cardName, mechEnum)
    state.events.push({ type: EventTypeEnum.MECHANIC, mechanicName: mechEnum, cardName, playedBy })
}

export const addedMechanicEvent = (mechEnum: MechanicEnum, playedBy, state: GameState) => {
    console.log("added effect", mechEnum);
    state.events.push({ type: EventTypeEnum.ADDED_MECHANIC, mechanicName: mechEnum, playedBy })
}

export const addGameOverEvent = (winner: number, state: GameState) => {
    state.events.push({ type: EventTypeEnum.GAME_OVER, winner })
}


export const addRevealPredictionEvent = (correct: boolean, prediction: PredictionEnum, card: Card, state: GameState) => {
    const correctGuesses: PredictionEnum[] = [];
    if (state.modifiedAxis.distance) correctGuesses.push(PredictionEnum.DISTANCE);
    if (state.modifiedAxis.motion) correctGuesses.push(PredictionEnum.MOTION);
    if (state.modifiedAxis.standing) correctGuesses.push(PredictionEnum.STANDING);
    if (correctGuesses.length === 0) correctGuesses.push(PredictionEnum.NONE);
    state.events.push({ type: EventTypeEnum.REVEAL_PREDICTION, correct, prediction, correctGuesses, cardName: card.name, playedBy: card.player })
}

export const addCardEvent = (card: Card, state: GameState) => {
    state.events.push({ type: EventTypeEnum.CARD_NAME, playedBy: card.player, cardName: card.name })
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
    [MechanicEnum.PREDICT]: true
}

//They have their own printed versions
const addableMechanics: { [name: string]: boolean } = {
    [MechanicEnum.BLOCK]: true,
    [MechanicEnum.CRIPPLE]: true,
    [MechanicEnum.LOCK]: true,
    [MechanicEnum.FORCEFUL]: true,
}