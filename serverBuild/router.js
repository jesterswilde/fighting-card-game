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
const premade_1 = require("./decks/premade");
const decks_1 = require("./decks");
const Cards_1 = require("./cards/Cards");
const sortOrder_1 = require("./shared/sortOrder");
const styles_1 = require("./styles");
const router_1 = require("./users/router");
const router_2 = require("./decks/router");
const router = express_1.Router();
router.use('/users', router_1.userRouter);
router.use('/decks', router_2.decksRouter);
router.get('/deckList', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const decks = yield decks_1.getDeckOptions();
    res.status(200).send(decks);
}));
router.get('/deck/:deckName', (req, res) => {
    const { deckName = '' } = req.params;
    if (deckName) {
        const deck = premade_1.getDeckForViewer(deckName);
        if (deck) {
            res.status(200).send(deck);
            return;
        }
    }
    res.status(404).send();
});
router.post('/card', (req, res) => {
    const _a = req.body, { index } = _a, card = __rest(_a, ["index"]);
    sortOrder_1.sortCard(card);
    Cards_1.addCard(card, card.index);
    res.status(201).send();
});
router.get('/cards', (req, res) => {
    const cardList = Object.keys(Cards_1.allCards);
    res.status(200).send(cardList);
});
router.get('/card/:name', (req, res) => {
    const card = Cards_1.allCards[req.params.name];
    res.status(200).send(card || null);
});
router.get('/styles', (req, res) => {
    res.status(200).send(styles_1.getFightingStyles());
});
// router.get('/updatedb', () => {
//     const dbCards: DBCard[] = [];
//     for (const cardName in allCards) {
//         const card = allCards[cardName];
//         const dbCard = new DBCard(card);
//         dbCards.push(dbCard);
//     }
//     cardRepo.save(dbCards);
// })
router.get('/styles/:style', (req, res) => {
    const styleName = req.params.style;
    const style = styles_1.getFullFightingStyleByName(styleName);
    if (style) {
        res.status(200).send(style);
    }
    else {
        res.status(418).send();
    }
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
exports.default = router;
