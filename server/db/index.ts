import { createConnection, Repository } from "typeorm";
import { DBCard } from './entities/card';
import { DBDeck } from "./entities/deck";
import { DBUser } from "./entities/user";

export let cardRepo: Repository<DBCard>
export let deckRepo: Repository<DBDeck>
export let userRepo: Repository<DBUser>

createConnection({
    'type': 'postgres',
    'host': 'localhost',
    'username': 'postgres',
    'password': '',
    'database': 'fight',
    'synchronize': true,
    'entities': [
        DBCard,
        DBDeck,
        DBUser
    ]
}).then((connection)=>{
    cardRepo = connection.getRepository(DBCard); 
    deckRepo = connection.getRepository(DBDeck); 
    userRepo = connection.getRepository(DBUser); 
    console.log("conencted to db"); 
})