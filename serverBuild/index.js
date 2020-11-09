"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const socketIO = require("socket.io");
const path = require("path");
const cors = require("cors");
const http = require("http");
const lobby_1 = require("./gameServer/lobby");
const router_1 = require("./router");
require("./db/index");
process.on("uncaughtException", function (err) {
    console.log(err);
});
const port = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    pingInterval: 10000,
    pingTimeout: 60000,
});
lobby_1.default(io);
app.use(bodyParser.json());
app.use(cors());
app.use("/api", router_1.default);
app.use(express.static(path.join(__dirname, "..", "game-client", "dist")));
app.get("*", (req, res) => {
    res
        .status(200)
        .sendFile(path.resolve(__dirname, "..", "game-client", "dist", "index.html"));
});
server.listen(port, () => console.log("listening on port " + port));
