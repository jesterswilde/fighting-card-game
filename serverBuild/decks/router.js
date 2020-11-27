"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decksRouter = void 0;
const express_1 = require("express");
const _1 = require(".");
const auth_1 = require("../auth");
const error_1 = require("../error");
exports.decksRouter = express_1.Router();
/*
    All unity operations require a user to be signed in, may not be great.

    get /decks -> {name, id, description, styles[]}[] - Get all decks by user
    get /deck/:id -> DeckDescription - Get specific deck by user
    DOESN'T SEND ID BUT SHOULD!  post /deck -> id - Makes a new deck by user
    put /deck/:id -> null - updates deck with id by user
    delete /deck/:id -> null - deletes a deck with id by user
*/
//Should return an abridged version of all your decks. Names, maybe description, styles in use. Possibly card names, not full cards.
exports.decksRouter.get("/", auth_1.authMiddleware, async (req, res) => {
    console.log("Got deck request from: " + req.user);
    try {
        const decks = await _1.getUsersDecks(req.user);
        res.status(200).send(decks);
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
//Returns all info a given deck. Currently sends full cards plus possible cards.
//This is an area to optimize later.
exports.decksRouter.get("/:id", auth_1.authMiddleware, async (req, res) => {
    try {
        const deck = await _1.getUsersDeck(req.user, req.params.id);
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
});
//Makes a new deck
exports.decksRouter.post("/new", auth_1.authMiddleware, async (req, res) => {
    try {
        const deck = await _1.makeDeck(req.user);
        res.status(200).send(deck);
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
//Updates a deck
exports.decksRouter.put("/:id", auth_1.authMiddleware, async (req, res) => {
    try {
        await _1.updateDeck(req.user, req.params.id, req.body);
        res.status(200).send();
    }
    catch (err) {
        if (err === error_1.ErrorEnum.CARDS_ARENT_IN_STYLES ||
            err === error_1.ErrorEnum.TOO_MANY_STYLES) {
            res.status(400).send(err);
        }
        else {
            console.error(err);
            res.status(500).send();
        }
    }
});
//Deletes a deck
exports.decksRouter.delete("/:id", auth_1.authMiddleware, async (req, res) => {
    try {
        await _1.deleteDeck(req.user, req.params.id);
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
});
