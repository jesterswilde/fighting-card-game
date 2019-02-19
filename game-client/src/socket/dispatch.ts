import { ConnectSocketAction, SocketActionEnum, DisconnectSocketAction } from "./actions";
import { store } from "../state/store";

export const dispatchConnectSocket = ()=>{
    const action: ConnectSocketAction = {
        type: SocketActionEnum.CONNECT
    }
    store.dispatch(action); 
}

export const dispatchDisconnectSocket = ()=>{
    const action: DisconnectSocketAction = {
        type: SocketActionEnum.DISCONNECT
    }
    store.dispatch(action); 
}