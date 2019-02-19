import * as socketClient from 'socket.io-client'; 
import { setupSockets } from './socketMessages';


let url; 
if(location.host.split(':')[0] === 'localhost'){
    url = 'localhost:8080'
}

export let socket: SocketIOClient.Socket; 

export const connectSocket = ()=>{
    socket = socketClient.connect(url);
    setupSockets(socket); 
    return socket; 
}

export const disconnectSocket = ()=>{
    if(socket){
        socket.disconnect(); 
    }
    socket = null; 
    return null; 
}



 