import { DBDeck } from "../db/entities/deck";
import { DBUser } from "../db/entities/user";
import { deckRepo, cardRepo } from "../db";
import { getConnection } from "typeorm";
import { ErrorEnum } from "../error";
import { MAX_STYLES } from "../config";

export const makeDeck = (user: DBUser) => {
    const deck = new DBDeck();
    deck.user = user;
    deck.name = "New Deck";
    deckRepo.save(deck);
}

export const deleteDeck = async (user: DBUser, deckID: number) => {
    // const deck = await deckRepo.findOne(deckID); 
    // if(deck){
    //     deckRepo.delete(deck); 
    // }
    const deck = await getValidDeck(user, deckID); 
    deckRepo.delete(deck); 
}

export const updateDeckCards = async (user: DBUser, deckID: number, cardNames: string[]) => {
    const deck = await getValidDeck(user, deckID); 
    const cardsQuery = cardNames.map((name) => ({ name }));
    const cards = await cardRepo.find({
        where: cardsQuery
    })
    deck.cards = cards;
    deckRepo.save(deck);
}

export const updateDeckStyles = async (user: DBUser, deckID: number, styles: string[]) => {
    if(styles.length > MAX_STYLES){
        return; 
    }
    const deck = await getValidDeck(user, deckID);
    
}

const getValidDeck = async (user: DBUser, deckID: number) => {
    const deck = await deckRepo.findOne({ id: deckID });
    if(deck.user.id !== user.id){
        throw ErrorEnum.DOESNT_OWN_DECK; 
    }
    return deck; 
}