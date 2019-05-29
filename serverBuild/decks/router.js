"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const _1 = require(".");
const auth_1 = require("../auth");
const error_1 = require("../error");
exports.decksRouter = express_1.Router();
//This gets full versions of all cards given a set of styles. 
exports.decksRouter.get('/possibleCards', (req, res) => {
    const { styles } = req.query;
    if (styles) {
        const stylesArray = styles.split(',');
        const possibleCards = _1.getPossibleCards(stylesArray);
        res.status(200).send(possibleCards);
    }
    else {
        res.status(200).send([]);
    }
});
//Should return an abridges version of all your decks. Names, maybe description, styles in use. Possibly card names, not full cards. 
exports.decksRouter.get('/', auth_1.authMiddleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const decks = yield _1.getUsersDecks(req.user);
        res.status(200).send(decks);
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
}));
//Returns all info a given deck. Currently sends full cards plus possible cards. 
//This is an area to optimize later. 
exports.decksRouter.get('/:id', auth_1.authMiddleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const deck = yield _1.getFullDeck(req.user, req.params.id);
        res.status(200).send(deck);
    }
    catch (err) {
        if (err === error_1.ErrorEnum.DOESNT_OWN_DECK) {
            res.status(403).send();
        }
        else {
            console.error(err);
            res.status(500).send();
        }
    }
}));
//Makes a new deck
exports.decksRouter.post('/new', auth_1.authMiddleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const deck = yield _1.makeDeck(req.user);
        res.status(200).send(deck);
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
}));
//Updates a deck
exports.decksRouter.put('/:id', auth_1.authMiddleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield _1.updateDeck(req.user, req.params.id, req.body);
        res.status(200).send();
    }
    catch (err) {
        if (err === error_1.ErrorEnum.CARDS_ARENT_IN_STYLES || err === error_1.ErrorEnum.TOO_MANY_STYLES) {
            res.status(400).send(err);
        }
        else {
            console.error(err);
            res.status(500).send();
        }
    }
}));
//Deletes a deck
exports.decksRouter.delete('/:id', auth_1.authMiddleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield _1.deleteDeck(req.user, req.params.id);
        res.status(200).send();
    }
    catch (err) {
        if (err === error_1.ErrorEnum.DOESNT_OWN_DECK) {
            res.status(403).send();
        }
        else {
            console.error(err);
            res.status(500);
        }
    }
}));
