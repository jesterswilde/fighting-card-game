"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onDBReady = exports.feedbackRepo = exports.userRepo = exports.deckRepo = void 0;
const typeorm_1 = require("typeorm");
const urLReader = require("pg-connection-string");
const deck_1 = require("./entities/deck");
const user_1 = require("./entities/user");
const feedback_1 = require("./entities/feedback");
let dbMethods = [];
let dbConnection;
exports.onDBReady = (cb) => {
    if (dbConnection === undefined) {
        dbMethods.push(cb);
    }
    else {
        cb(dbConnection);
    }
};
let connectionObj = {
    type: "postgres",
    host: "localhost",
    username: "postgres",
    password: "password",
    database: "fight",
    synchronize: true,
    entities: [deck_1.DBDeck, user_1.DBUser, feedback_1.DBFeedback]
};
if (process.env.DATABASE_URL) {
    const dbURL = urLReader.parse(process.env.DATABASE_URL);
    connectionObj = {
        ...connectionObj,
        ...{
            database: dbURL.database,
            username: dbURL.user,
            password: dbURL.password,
            host: dbURL.host,
            port: Number(dbURL.port),
            extras: { ssl: true }
        }
    };
}
typeorm_1.createConnection(connectionObj).then(connection => {
    exports.deckRepo = connection.getRepository(deck_1.DBDeck);
    exports.userRepo = connection.getRepository(user_1.DBUser);
    exports.feedbackRepo = connection.getRepository(feedback_1.DBFeedback);
    dbConnection = connection;
    dbMethods.forEach(cb => cb(connection));
    dbMethods = undefined;
    console.log("conencted to db");
});
