import { allCards } from '../../cards/Cards';
import { grappleDeck } from './deckGrapple';
import { highGroundDeck } from './deckHighGround';
import { gladiatorDeck } from './deckGaldiator';
import { stoneDeck } from './deckStone';
import { inspectorGadgetDeck } from './deckInspectorGadget';
import { DeckDescription, DeckSelection } from '../interface';
import { ASDFdeck } from './deckASDF';
import { bloodInWaterDeck } from './deckBloodInWater';
import { boxerDeck } from './deckBoxer';
import { jesterDeck } from './deckJester';
import { hunterDeck } from './deckHunter';
import { userRepo, deckRepo } from '../../db';



const testDeck = ['IsFresh','IsFresh','IsFresh']

export const decks: DeckDescription[] = [
    grappleDeck,
    highGroundDeck,
    gladiatorDeck,
    stoneDeck,
    bloodInWaterDeck,
    inspectorGadgetDeck,
    hunterDeck,
    jesterDeck,
    boxerDeck,
    ASDFdeck,
    { name: 'test', deckList: testDeck, description: "Test deck, don't click this" },
]

export const getDeckForViewer = (name: string) => {
    const deckObj = decks.find((deck) => deck.name === name);
    if (!deckObj) {
        return null;
    }
    const cards = getDeck(deckObj);
    return {
        name: deckObj.name,
        description: deckObj.description || 'No Description',
        cards
    }
}

export const getStandardDecks = (): DeckSelection[] => {
    return decks.map((deck) => ({ name: deck.name, description: deck.description }));
}


export const getDeck = async (deckSelection: DeckSelection) => {
    const deck = await getDeckDescription(deckSelection);
    return filterDeck(deck); 
}

const getDeckDescription = async ({ name, id, isCustom }: DeckSelection): Promise<DeckDescription> => {
    let deck: DeckDescription;
    if (isCustom) {
        const deckDB = await deckRepo.findOne({ id })
        if (!deckDB) {
            return null;
        }
        deck = deckDB.toDeckDescription();
    } else {
        deck = decks.find((deck) => deck.name === name);
    }
    if (!deck) {
        return null;
    }
    return deck;
}

const filterDeck = (deck: DeckDescription) => {
    const filteredDeck = deck.deckList.map((name) => {
        const card = allCards[name]
        if (!card) {
            console.log("error, card not found", name);
            return null;
        }
        return card;
    }).filter((card) => card !== null);
    return filteredDeck;
}
