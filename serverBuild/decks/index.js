"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cards_1 = require("../cards/Cards");
const deckGrapple_1 = require("./deckGrapple");
const deckHighGround_1 = require("./deckHighGround");
const deckGaldiator_1 = require("./deckGaldiator");
const deckStone_1 = require("./deckStone");
const deckBloodInWater_1 = require("./deckBloodInWater");
const deckASDF_1 = require("./deckASDF");
const deckInspectorGadget_1 = require("./deckInspectorGadget");
const testDeck = ["WillTelegraph", "WillTelegraph", "TelegraphTest"];
exports.decks = [
    { name: 'Grapple', deckList: deckGrapple_1.grappleDeck, description: "Excels at fighting while Grappled and Prone. Wants to play the card Neck Break (requires Grappled, Both Prone, and Balanced." },
    { name: 'High Ground', deckList: deckHighGround_1.highGroundDeck, description: "Wants to be standing while the opponent is prone. Tries very hard to avoid negative statuses" },
    { name: 'Gladiator', deckList: deckGaldiator_1.gladiatorDeck, description: "The deck wants to have anticipation, and the enemy be off balanced. It wants to be on it's feet, with the opponent moving or prone" },
    { name: 'Stone Skin', deckList: deckStone_1.stoneDeck, description: "Focuses on block, choice, and momentum. Performs poorly if allowed to be unbalanced." },
    { name: 'Blood In The Water', deckList: deckBloodInWater_1.bloodInWaterDeck, description: deckBloodInWater_1.bloodInWaterDescription },
    { name: deckASDF_1.ASDFname, deckList: deckASDF_1.ASDFdeck, description: deckASDF_1.ASDFdescription },
    { name: deckInspectorGadget_1.inspectorGadgetName, deckList: deckInspectorGadget_1.inspectorGadgetDeck, description: deckInspectorGadget_1.inspectorGadgetDescription },
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
