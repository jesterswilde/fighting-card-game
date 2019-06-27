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
const Cards_1 = require("../../cards/Cards");
const deckGrapple_1 = require("./deckGrapple");
const deckHighGround_1 = require("./deckHighGround");
const deckGaldiator_1 = require("./deckGaldiator");
const deckStone_1 = require("./deckStone");
const deckInspectorGadget_1 = require("./deckInspectorGadget");
const deckASDF_1 = require("./deckASDF");
const deckBloodInWater_1 = require("./deckBloodInWater");
const deckBoxer_1 = require("./deckBoxer");
const deckJester_1 = require("./deckJester");
const deckHunter_1 = require("./deckHunter");
const db_1 = require("../../db");
const testDeck = ['IsFresh', 'IsFresh', 'IsFresh'];
exports.decks = [
    deckGrapple_1.grappleDeck,
    deckHighGround_1.highGroundDeck,
    deckGaldiator_1.gladiatorDeck,
    deckStone_1.stoneDeck,
    deckBloodInWater_1.bloodInWaterDeck,
    deckInspectorGadget_1.inspectorGadgetDeck,
    deckHunter_1.hunterDeck,
    deckJester_1.jesterDeck,
    deckBoxer_1.boxerDeck,
    deckASDF_1.ASDFdeck,
    { name: 'test', deckList: testDeck, description: "Test deck, don't click this" },
];
exports.getDeckForViewer = (name) => {
    const deckObj = exports.decks.find((deck) => deck.name === name);
    if (!deckObj) {
        return null;
    }
    const cards = exports.getDeck(deckObj);
    return {
        name: deckObj.name,
        description: deckObj.description || 'No Description',
        cards
    };
};
exports.getStandardDecks = () => {
    return exports.decks.map((deck) => ({ name: deck.name, description: deck.description }));
};
exports.getDeck = (deckSelection) => __awaiter(this, void 0, void 0, function* () {
    const deck = yield getDeckDescription(deckSelection);
    return filterDeck(deck);
});
const getDeckDescription = ({ name, id, isCustom }) => __awaiter(this, void 0, void 0, function* () {
    let deck;
    if (isCustom) {
        const deckDB = yield db_1.deckRepo.findOne({ id });
        if (!deckDB) {
            return null;
        }
        deck = deckDB.toDeckDescription();
    }
    else {
        deck = exports.decks.find((deck) => deck.name === name);
    }
    if (!deck) {
        return null;
    }
    return deck;
});
const filterDeck = (deck) => {
    const filteredDeck = deck.deckList.map((name) => {
        const card = Cards_1.allCards[name];
        if (!card) {
            console.log("error, card not found", name);
            return null;
        }
        return card;
    }).filter((card) => card !== null);
    return filteredDeck;
};
