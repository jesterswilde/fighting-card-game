import * as socketClient from 'socket.io-client'; 
import { setupSockets } from './socketMessages';


let url; 
if(location.host.split(':')[0] === 'localhost'){
    url = 'localhost:8080'
}
export const socket = socketClient.connect(url); 

setupSockets(socket); 
 