"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const urLReader = require("pg-connection-string");
const card_1 = require("./entities/card");
const deck_1 = require("./entities/deck");
const user_1 = require("./entities/user");
let connectionObj = {
    type: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: '',
    database: 'fight',
    synchronize: true,
    entities: [
        card_1.DBCard,
        deck_1.DBDeck,
        user_1.DBUser
    ]
};
if (process.env.DATABASE_URL) {
    console.log("Found db url");
    const dbURL = urLReader.parse(process.env.DATABASE_URL);
    connectionObj = Object.assign({}, connectionObj, {
        database: 'DATABASE',
        username: dbURL.user,
        password: dbURL.password,
        host: dbURL.host,
        port: dbURL.port,
        extras: { ssl: true }
    });
}
typeorm_1.createConnection(connectionObj).then((connection) => {
    exports.cardRepo = connection.getRepository(card_1.DBCard);
    exports.deckRepo = connection.getRepository(deck_1.DBDeck);
    exports.userRepo = connection.getRepository(user_1.DBUser);
    console.log("conencted to db");
});
