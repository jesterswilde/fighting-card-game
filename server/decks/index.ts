import { cards } from '../cards/Cards';
import { grappleDeck } from './deckGrapple';
import { highGroundDeck } from './deckHighGround';
import { gladiatorDeck } from './deckGaldiator';
import { stoneDeck } from './deckStone';
import { inspectorGadgetDeck } from './deckInspectorGadget';
import { DeckDescription } from './interface';
import { ASDFdeck } from './deckASDF';
import { bloodInWaterDeck } from './deckBloodInWater';
import { boxerDeck } from './deckBoxer';




const testDeck = []

export const decks: DeckDescription[] = [
    grappleDeck,
    highGroundDeck,
    gladiatorDeck,
    stoneDeck,
    bloodInWaterDeck,
    inspectorGadgetDeck,
    ASDFdeck,
    boxerDeck,
    { name: 'test', deckList: testDeck, description: "Test deck, don't click this" },
]

export const getDeckForViewer = (name: string)=>{
    const deckObj =  decks.find((deck) => deck.name === name);
    if (!deckObj) {
        return null;
    }
    const cards = getDeck(name); 
    return {
        name: deckObj.name,
        description: deckObj.description || 'No Description',
        cards
    }
}

export const getDeckOptions = () => {
    return decks.map((deck) => ({ name: deck.name, description: deck.description }));
}

export const getDeck = (name: string) => {
    const deck = decks.find((deck) => deck.name === name);
    if (!deck) {
        return null;
    }
    const filteredDeck = deck.deckList.map((name) => {
        const card = cards[name]
        if (!card) {
            console.log("error, card not found", name);
            return null;
        }
        return card;
    }).filter((card) => card !== null);
    return filteredDeck;
}

