import { store } from "../state/store";
import { HandActionEnum, PickedCardAction, GotHandStateAction, OppGotCardsAction, OppPickedCardAction } from "./actions";
import { Card } from "../shared/card";
import { socket } from "../socket/socket";
import { SocketEnum } from "../shared/socket";
import { HandState } from "./interface";

export const dispatchOppGotCards = (cards: number)=>{
    const action: OppGotCardsAction = {
        type: HandActionEnum.OPPONENT_GOT_CARDS,
        cards
    }
    store.dispatch(action); 
}

export const dispatchOppPickedCard = ()=>{
    const action: OppPickedCardAction = {
        type: HandActionEnum.OPPONENT_PICKED_CARD
    }
    store.dispatch(action); 
}

export const dispatchPickedCard = (cardNumber: number)=>{
    socket.emit(SocketEnum.PICKED_CARD, cardNumber); 
    const action: PickedCardAction = {
        type: HandActionEnum.PICKED_CARD,
        index: cardNumber
    }
    store.dispatch(action)
}

export const dispatchGotHandState = (handState: HandState)=>{
    const action: GotHandStateAction = {
        type: HandActionEnum.GOT_HAND_STATE,
        handState
    }
    store.dispatch(action); 
}