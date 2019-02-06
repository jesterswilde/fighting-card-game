import { GotDeckChoicesAction, PickedDeckAction, DeckActionEnum } from "./actions";
import { store } from "../state/store";
import { socket } from "../socket/socket";
import { SocketEnum } from "../socket/socketEnum";
import { DeckChoice } from "./interfaces";



export const dispatchGotDeckChoices = (choices: DeckChoice[])=>{
    const action: GotDeckChoicesAction = {
        type: DeckActionEnum.GOT_DECK_CHOICES,
        choices
    }
    store.dispatch(action); 
}

export const dispatchPickedDeck = (choice: number)=>{
    const action: PickedDeckAction = {
        type: DeckActionEnum.PICKED_DECK,
        choice
    }
    socket.emit(SocketEnum.PICKED_DECK, choice); 
    store.dispatch(action); 
}
