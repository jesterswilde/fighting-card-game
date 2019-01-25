import * as socketClient from 'socket.io-client'; 
import { setupSockets } from './socketMessages';

const url = 'localhost:8080'
export const socket = socketClient.connect(url); 

setupSockets(socket); 
 