import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as socketIO from 'socket.io';
import * as path from 'path';
import * as cors from 'cors';
import * as http from 'http';
import lobby from './gameServer/lobby';
import apiRouter from './router'; 
import './db/index'; 


const port = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);

const io = socketIO(server);
lobby(io);

app.use(bodyParser.json())
app.use(cors());

app.use('/api', apiRouter); 

app.use(express.static(path.join(__dirname,'..', 'game-client', 'dist')));

server.listen(port, () => console.log("listening on port " + port));