import { ActionType } from "../state/actionTypes";
import { SocketActionEnum } from "./actions";
import { connectSocket, disconnectSocket } from "./socket";

export const socketReducer = (state: SocketState = { socket: null }, action: ActionType): SocketState => {
    switch (action.type) {
        case SocketActionEnum.CONNECT:
            return reduceConnect(state); 
        case SocketActionEnum.DISCONNECT:
            return reduceDisconnect(state); 
        default:
            return state;
    }
}

const reduceConnect = (state: SocketState): SocketState=>{
    const socket = connectSocket(); 
    return {...state, socket}; 
}

const reduceDisconnect = (state: SocketState): SocketState=>{
    disconnectSocket(); 
    return {...state, socket: null}
}