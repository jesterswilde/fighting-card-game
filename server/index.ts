import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as socketIO from 'socket.io';
import * as path from 'path';
import * as cors from 'cors';
import * as http from 'http';
import lobby from './gameServer/lobby'
import { addCard, cards, removeCard } from './cards/Cards';
const port = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);

const io = socketIO(server);
lobby(io);

app.use(bodyParser.json())
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'front-end', 'build')));

app.post('/card', (req, res) => {
    const { index, ...card } = req.body;
    addCard(card, index);
    res.status(201).send();
})
app.get('/cards', (req, res) => {
    res.status(200).send(cards); 
})
app.delete('/card', async(req,res)=>{
    try{
        await removeCard(req.body.name);
        res.status(200).send(); 
    }catch(err){
        console.error(err);
        res.status(400).send(); 
    }
})

server.listen(port, () => console.log("listening on port " + port));