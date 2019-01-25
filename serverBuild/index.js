"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const socketIO = require("socket.io");
const path = require("path");
const cors = require("cors");
const http = require("http");
const lobby_1 = require("./gameServer/lobby");
const Cards_1 = require("./cards/Cards");
const port = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
lobby_1.default(io);
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'front-end', 'build')));
app.post('/card', (req, res) => {
    const _a = req.body, { index } = _a, card = __rest(_a, ["index"]);
    Cards_1.addCard(card, index);
    res.status(201).send();
});
app.get('/cards', (req, res) => {
    res.status(200).send(Cards_1.cards);
});
app.delete('/card', (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield Cards_1.removeCard(req.body.name);
        res.status(200).send();
    }
    catch (err) {
        console.error(err);
        res.status(400).send();
    }
}));
server.listen(port, () => console.log("listening on port " + port));
