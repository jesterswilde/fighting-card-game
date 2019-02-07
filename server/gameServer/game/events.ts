import { Mechanic, MechanicEnum, Card } from "../interfaces/cardInterface";
import { GameState } from "../interfaces/stateInterface";
import { EventTypeEnum } from "../interfaces/gameEvent";
import { SocketEnum } from "../interfaces/socket";

export const addEffectEvent = (mechanic: Mechanic, playedBy: number, state: GameState)=>{
    if(mechanic.mechanic === undefined || addableMechanics[mechanic.mechanic]){
        state.events.push({effect: mechanic, type: EventTypeEnum.EFFECT, playedBy}); 
    }
}

export const addMechanicEvent = (mecheEnum: MechanicEnum, card: Card, state: GameState)=>{
    state.events.push({type: EventTypeEnum.MECHANIC, mechanicName: mecheEnum, cardName: card.name, playedBy: card.player})
}

export const addCardEvent = (card: Card, state: GameState)=>{
    state.events.push({type: EventTypeEnum.CARD_NAME, playedBy: card.player, cardName: card.name})
}

export const sendEvents = (state: GameState)=>{
    state.sockets.forEach((socket)=>{
        socket.emit(SocketEnum.GOT_EVENTS, state.events); 
    })
    state.events = []; 
}

const addableMechanics: {[name: string]: boolean} = {
    [MechanicEnum.BLOCK]: true,
    [MechanicEnum.CRIPPLE]: true,
    [MechanicEnum.LOCK]: true
}