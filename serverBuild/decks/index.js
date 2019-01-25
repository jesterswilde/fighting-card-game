"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cards_1 = require("../cards/Cards");
const deckGrapple_1 = require("./deckGrapple");
const deckHighGround_1 = require("./deckHighGround");
const deckGaldiator_1 = require("./deckGaldiator");
exports.decks = [
    { name: 'Grapple', deckList: deckGrapple_1.grappleDeck },
    { name: 'High Ground', deckList: deckHighGround_1.highGroundDeck },
    { name: 'Gladiator', deckList: deckGaldiator_1.gladiatorDeck }
];
exports.getDeckOptions = () => {
    return exports.decks.map((desc) => desc.name);
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
