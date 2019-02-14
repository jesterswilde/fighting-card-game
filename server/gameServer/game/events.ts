import { Mechanic, MechanicEnum, Card } from "../interfaces/cardInterface";
import { GameState, PredictionEnum } from "../interfaces/stateInterface";
import { EventTypeEnum } from "../interfaces/gameEvent";
import { SocketEnum } from "../interfaces/socket";

export const addEffectEvent = (mechanic: Mechanic, playedBy: number, state: GameState) => {
    if (mechanic.mechanic === undefined || addableMechanics[mechanic.mechanic]) {
        state.events.push({ effect: mechanic, type: EventTypeEnum.EFFECT, playedBy });
    } else {
        if (mechanic.mechanic !== MechanicEnum.REFLEX) {
            addedMechanicEvent(mechanic.mechanic, playedBy, state);
        }
    }
}

export const addMechanicEvent = (mechEnum: MechanicEnum, card: Card, state: GameState) => {
    state.events.push({ type: EventTypeEnum.MECHANIC, mechanicName: mechEnum, cardName: card.name, playedBy: card.player })
}

export const addedMechanicEvent = (mechEnum: MechanicEnum, playedBy, state: GameState) => {
    state.events.push({ type: EventTypeEnum.ADDED_MECHANIC, mechanicName: mechEnum, playedBy })
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

const addableMechanics: { [name: string]: boolean } = {
    [MechanicEnum.BLOCK]: true,
    [MechanicEnum.CRIPPLE]: true,
    [MechanicEnum.LOCK]: true,
    [MechanicEnum.FORCEFUL]: true
}