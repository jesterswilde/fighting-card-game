"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const card_1 = require("./entities/card");
const deck_1 = require("./entities/deck");
const user_1 = require("./entities/user");
typeorm_1.createConnection({
    'type': 'postgres',
    'host': 'localhost',
    'username': 'postgres',
    'password': '',
    'database': 'fight',
    'synchronize': true,
    'entities': [
        card_1.DBCard,
        deck_1.DBDeck,
        user_1.DBUser
    ]
}).then((connection) => {
    exports.cardRepo = connection.getRepository(card_1.DBCard);
    exports.deckRepo = connection.getRepository(deck_1.DBDeck);
    exports.userRepo = connection.getRepository(user_1.DBUser);
    console.log("conencted to db");
});
