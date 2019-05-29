import { ActionType } from "../state/actionTypes";
import { SocketActionEnum } from "./actions";
import { connectSocket, disconnectSocket } from "./socket";

export const socketReducer = (state: SocketState = { socket: null }, action: ActionType): SocketState => {
    switch (action.type) {
        case SocketActionEnum.CONNECT:
        return {...state, socket: action.socket}; 
        case SocketActionEnum.DISCONNECT:
            return {...state, socket: null}
        default:
            return state;
    }
}