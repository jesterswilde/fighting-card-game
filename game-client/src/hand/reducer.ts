import { HandState } from "./interface";
import { ActionType } from "../state/actionTypes";
import { HandActionEnum, PickedCardAction } from "./actions";
import { socket } from "../socket/socket";
import { SocketEnum } from "../socket/socketEnum";

export const handReducer = (state: HandState = makeDefaultState(), action: ActionType): HandState=>{
    switch(action.type){
        case HandActionEnum.GOT_CARDS: 
            return {...state, cards: action.cards}
        case HandActionEnum.PICKED_CARD:
            return pickedCardReducer(state, action); 
        default: 
            return state
    }
}

const pickedCardReducer = (state: HandState, {index}: PickedCardAction): HandState=>{
    socket.send(SocketEnum.PICKED_CARD, index);
    return {
        ...state,
        cards: []
    }
}

const makeDefaultState = (): HandState=>{
    return {
        cards: []
    }
}