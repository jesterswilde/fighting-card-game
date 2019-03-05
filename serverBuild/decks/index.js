"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cards_1 = require("../cards/Cards");
const deckGrapple_1 = require("./deckGrapple");
const deckHighGround_1 = require("./deckHighGround");
const deckGaldiator_1 = require("./deckGaldiator");
const deckStone_1 = require("./deckStone");
const deckInspectorGadget_1 = require("./deckInspectorGadget");
const deckASDF_1 = require("./deckASDF");
const deckBloodInWater_1 = require("./deckBloodInWater");
const deckBoxer_1 = require("./deckBoxer");
const testDeck = ["Lunge", "Study Balance", "Hit The Floor"];
exports.decks = [
    deckGrapple_1.grappleDeck,
    deckHighGround_1.highGroundDeck,
    deckGaldiator_1.gladiatorDeck,
    deckStone_1.stoneDeck,
    deckBloodInWater_1.bloodInWaterDeck,
    deckInspectorGadget_1.inspectorGadgetDeck,
    deckASDF_1.ASDFdeck,
    deckBoxer_1.boxerDeck,
    { name: 'test', deckList: testDeck, description: "Test deck, don't click this" },
];
exports.getDeckForViewer = (name) => {
    const deckObj = exports.decks.find((deck) => deck.name === name);
    if (!deckObj) {
        return null;
    }
    const cards = exports.getDeck(name);
    return {
        name: deckObj.name,
        description: deckObj.description || 'No Description',
        cards
    };
};
exports.getDeckOptions = () => {
    return exports.decks.map((deck) => ({ name: deck.name, description: deck.description }));
};
exports.getDeck = (name) => {
    const deck = exports.decks.find((deck) => deck.name === name);
    if (!deck) {
        return null;
    }
    const filteredDeck = deck.deckList.map((name) => {
        const card = Cards_1.cards[name];
        if (!card) {
            console.log("error, card not found", name);
            return null;
        }
        return card;
    }).filter((card) => card !== null);
    return filteredDeck;
};
