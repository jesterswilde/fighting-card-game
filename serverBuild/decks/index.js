"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cards_1 = require("../cards/Cards");
const deckGrapple_1 = require("./deckGrapple");
const deckHighGround_1 = require("./deckHighGround");
const deckGaldiator_1 = require("./deckGaldiator");
const deckStone_1 = require("./deckStone");
const testDeck = ["Inertia", "Blocker", "focus_test"];
exports.decks = [
    { name: 'Grapple', deckList: deckGrapple_1.grappleDeck, description: "Excels at fighting while Grappled and Prone. Wants to play the card Neck Break (requires Grappled, Both Prone, and Balanced." },
    { name: 'High Ground', deckList: deckHighGround_1.highGroundDeck, description: "Wants to be standing while the opponent is prone. Tries very hard to avoid negative statuses" },
    { name: 'Gladiator', deckList: deckGaldiator_1.gladiatorDeck, description: "The deck wants to have anticipation, and the enemy be off balanced. It wants to be on it's feet, with the opponent moving or prone" },
    { name: 'Stone', deckList: deckStone_1.stoneDeck, description: "Focuses on block, choice, and momentum. Can do almost nothing if unbalanced." },
    { name: 'test', deckList: testDeck, description: "Test deck, don't click this" }
];
exports.getDeckOptions = () => {
    return exports.decks.map((deck) => ({ name: deck.name, description: deck.description }));
};
exports.getDeck = (name) => {
    const deck = exports.decks.find((deck) => deck.name === name);
    if (!deck) {
        return null;
    }
    const fiteredDeck = deck.deckList.map((name) => {
        const card = Cards_1.cards[name];
        if (!card) {
            console.log("error, card not found", name);
            return null;
        }
        return card;
    }).filter((card) => card !== null);
    return fiteredDeck;
};
