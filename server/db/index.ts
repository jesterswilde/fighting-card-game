import { createConnection, Repository, ConnectionOptions } from "typeorm";
import * as urLReader from 'pg-connection-string';
import { DBCard } from './entities/card';
import { DBDeck } from "./entities/deck";
import { DBUser } from "./entities/user";

export let cardRepo: Repository<DBCard>
export let deckRepo: Repository<DBDeck>
export let userRepo: Repository<DBUser>

let connectionObj: ConnectionOptions = {
    type: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: '',
    database: 'fight',
    synchronize: true,
    entities: [
        DBCard,
        DBDeck,
        DBUser
    ]
}

if (process.env.DATABASE_URL) {
    const dbURL = urLReader.parse(process.env.DATABASE_URL);
    connectionObj = {
        ...connectionObj, ...{
            username: dbURL.user,
            password: dbURL.password,
            host: dbURL.host,
            port: dbURL.port,
            extras: { ssl: true }
        }
    }
}


createConnection(connectionObj).then((connection) => {
    cardRepo = connection.getRepository(DBCard);
    deckRepo = connection.getRepository(DBDeck);
    userRepo = connection.getRepository(DBUser);
    console.log("conencted to db");
})