export enum SocketActionEnum{
    CONNECT = 'connectSocket',
    DISCONNECT = 'disconnectSocket',
}


export interface ConnectSocketAction{
    type: SocketActionEnum.CONNECT
    socket: SocketIOClient.Socket
}

export interface DisconnectSocketAction{
    type: SocketActionEnum.DISCONNECT
}


export type SocketActions = DisconnectSocketAction | ConnectSocketAction; 