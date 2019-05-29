import { ConnectSocketAction, SocketActionEnum, DisconnectSocketAction } from "./actions";
import { store } from "../state/store";
import { disconnectSocket, connectSocket } from "./socket";

export const dispatchConnectSocket = ()=>{
    const socket = connectSocket(); 
    const action: ConnectSocketAction = {
        type: SocketActionEnum.CONNECT,
        socket
    }
    store.dispatch(action); 
}

export const dispatchDisconnectSocket = ()=>{
    const action: DisconnectSocketAction = {
        type: SocketActionEnum.DISCONNECT
    }
    disconnectSocket(); 
    store.dispatch(action); 
}