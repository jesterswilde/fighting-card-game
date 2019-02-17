import { cards } from '../cards/Cards';
import { grappleDeck } from './deckGrapple';
import { highGroundDeck } from './deckHighGround';
import { gladiatorDeck } from './deckGaldiator';
import { stoneDeck } from './deckStone';
import { bloodInWaterDeck, bloodInWaterDescription } from './deckBloodInWater';

interface DeckDescription {
    name: string,
    deckList: string[]
    description?: string
}

const testDeck = ["WillTelegraph", "WillTelegraph", "TelegraphTest"]

export const decks: DeckDescription[] = [
    { name: 'Grapple', deckList: grappleDeck, description: "Excels at fighting while Grappled and Prone. Wants to play the card Neck Break (requires Grappled, Both Prone, and Balanced." },
    { name: 'High Ground', deckList: highGroundDeck, description: "Wants to be standing while the opponent is prone. Tries very hard to avoid negative statuses" },
    { name: 'Gladiator', deckList: gladiatorDeck, description: "The deck wants to have anticipation, and the enemy be off balanced. It wants to be on it's feet, with the opponent moving or prone" },
    { name: 'Stone Skin', deckList: stoneDeck, description: "Focuses on block, choice, and momentum. Performs poorly if allowed to be unbalanced." },
    {name: 'Blood In The Water', deckList: bloodInWaterDeck, description: bloodInWaterDescription},
    { name: 'test', deckList: testDeck, description: "Test deck, don't click this" },
]

export const getDeckOptions = () => {
    return decks.map((deck) => ({ name: deck.name, description: deck.description }));
}

export const getDeck = (name: string) => {
    const deck = decks.find((deck) => deck.name === name);
    if (!deck) {
        return null;
    }
    const fiteredDeck = deck.deckList.map((name) => {
        const card = cards[name]
        if (!card) {
            console.log("error, card not found", name);
            return null;
        }
        return card;
    }).filter((card) => card !== null);
    return fiteredDeck;
}

