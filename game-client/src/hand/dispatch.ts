import { store } from "../state/store";
import { HandActionEnum, PickedCardAction, GotCardsAction, OppGotCardsAction, OppPickedCardAction } from "./actions";
import { Card } from "../shared/card";
import { socket } from "../socket/socket";
import { SocketEnum } from "../shared/socket";

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

export const dispatchGotCards = (cards: Card[])=>{
    const action: GotCardsAction = {
        type: HandActionEnum.GOT_CARDS,
        cards
    }
    store.dispatch(action); 
}