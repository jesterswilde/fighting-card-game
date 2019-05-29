import * as socketClient from 'socket.io-client'; 
import { setupSockets } from './socketMessages';
import { store } from '../state/store';


let url; 
if(location.host.split(':')[0] === 'localhost'){
    url = 'localhost:8080'
}

export let socket: SocketIOClient.Socket; 

export const connectSocket = ()=>{
    const token = store.getState().user.token;
    //Token is in b64. This contains a couple characters (= and +) that are not URI safe. 
    socket = socketClient.connect(url + '?token='+ encodeURIComponent(token));
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



 