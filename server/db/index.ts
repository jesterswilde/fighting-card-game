import { createConnection, Repository, ConnectionOptions, Connection } from "typeorm";
import * as urLReader from "pg-connection-string";
import { DBDeck } from "./entities/deck";
import { DBUser } from "./entities/user";
import { DBFeedback } from "./entities/feedback";

export let deckRepo: Repository<DBDeck>;
export let userRepo: Repository<DBUser>;
export let feedbackRepo: Repository<DBFeedback>;

let dbMethods: Array<(conn: Connection) => void> = [];
let dbConnection: Connection;

export const onDBReady = (cb: (conn: Connection) => void) => {
  if (dbConnection === undefined) {
    dbMethods.push(cb);
  } else {
    cb(dbConnection);
  }
};

let connectionObj: ConnectionOptions = {
  type: "postgres",
  host: "localhost",
  username: "postgres",
  password: "password",
  database: "fight",
  synchronize: true,
  entities: [DBDeck, DBUser, DBFeedback],
};

if (process.env.DATABASE_URL) {
  const dbURL = urLReader.parse(process.env.DATABASE_URL);
  connectionObj = {
    ...connectionObj,
    ...{
      database: dbURL.database ?? undefined,
      username: dbURL.user,
      password: dbURL.password,
      host: dbURL.host ?? undefined,
      port: Number(dbURL.port),
      extras: { ssl: true },
    },
  };
}

export const connectDatabase = async () => {
  const connection = await createConnection(connectionObj);
  deckRepo = connection.getRepository(DBDeck);
  userRepo = connection.getRepository(DBUser);
  feedbackRepo = connection.getRepository(DBFeedback);

  dbConnection = connection;
  dbMethods.forEach((cb) => cb(connection));
  dbMethods = [];
  console.log("connected to db");
};
