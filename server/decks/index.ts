import {cards} from '../cards/Cards'; 
import { grappleDeck } from './deckGrapple';
import { highGroundDeck } from './deckHighGround';
import { gladiatorDeck } from './deckGaldiator';
import { Z_FILTERED } from 'zlib';

interface DeckDescription{
    name: string,
    deckList: string[]
}

export const decks: DeckDescription[] = [
    {name: 'Grapple', deckList: grappleDeck}, 
    {name: 'High Ground', deckList: highGroundDeck}, 
    {name: 'Gladiator', deckList: gladiatorDeck}
]

export const getDeckOptions = ()=>{
    return decks.map((desc)=> desc.name); 
}

export const getDeck = (name: string)=>{
    const deck = decks.find((deck)=> deck.name === name);
    if(!deck){
        return null; 
    } 
    const fiteredDeck =  deck.deckList.map((name)=> {
        const card = cards[name]
        if(!card){
            console.log("error, card not found", name); 
            return null;
        }
        return card; 
    }).filter((card)=> card !== null);
    return fiteredDeck;  
}

