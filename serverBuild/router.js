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
const express_1 = require("express");
const decks_1 = require("./decks");
const Cards_1 = require("./cards/Cards");
const router = express_1.Router();
router.get('/deckList', (req, res) => {
    res.status(200).send(getDeckList());
});
router.get('/deck/:deckName', (req, res) => {
    const { deckName = '' } = req.params;
    if (deckName) {
        const deck = decks_1.getDeckForViewer(deckName);
        if (deck) {
            res.status(200).send(deck);
            return;
        }
    }
    res.status(404).send();
});
router.post('/card', (req, res) => {
    const _a = req.body, { index } = _a, card = __rest(_a, ["index"]);
    Cards_1.addCard(card, index);
    res.status(201).send();
});
router.get('/cards', (req, res) => {
    const cardList = Object.keys(Cards_1.cards);
    res.status(200).send(cardList);
});
router.get('/card/:name', (req, res) => {
    const card = Cards_1.cards[req.params.name];
    res.status(200).send(card || null);
});
router.delete('/card', (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield Cards_1.removeCard(req.body.name);
        res.status(200).send();
    }
    catch (err) {
        console.error(err);
        res.status(400).send();
    }
}));
const getDeckList = () => {
    return decks_1.getDeckOptions();
};
exports.default = router;
